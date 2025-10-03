// app/api/auth/request-code/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/hash';       // jeśli masz helper
import { sendVerificationCode } from '@/lib/mailer';

type Role = 'provider' | 'client';

export async function POST(req: Request) {
  try {
    const { email, password, role } = (await req.json()) as {
      email?: string;
      password?: string;
      role?: Role;
    };

    if (!email || !password || !role) {
      return NextResponse.json({ ok: false, error: 'Brak danych' }, { status: 400 });
    }

    // hash hasła z kroku 1
    const passwordHash = await hashPassword(password);

    // 6-cyfrowy kod i ważność
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // usuń poprzedni kod dla tego e-maila (bo email jest @unique)
    await prisma.verificationCode.deleteMany({ where: { email } });

    await prisma.verificationCode.create({
      data: { email, code, passwordHash, role, expiresAt },
    });

    // wysyłka e-maila
    await sendVerificationCode(email, code);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[request-code]', err);
    return NextResponse.json(
      { ok: false, error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
