// app/api/auth/verify-code/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, code } = (await req.json()) as { email?: string; code?: string };
    if (!email || !code) {
      return NextResponse.json({ ok: false, error: 'Brak danych' }, { status: 400 });
    }

    const rec = await prisma.verificationCode.findUnique({ where: { email } });
    if (!rec) {
      return NextResponse.json({ ok: false, error: 'Nie znaleziono kodu' }, { status: 404 });
    }
    if (rec.consumed) {
      return NextResponse.json({ ok: false, error: 'Kod już użyty' }, { status: 400 });
    }
    if (rec.expiresAt < new Date()) {
      return NextResponse.json({ ok: false, error: 'Kod wygasł' }, { status: 400 });
    }
    if (rec.code !== code) {
      return NextResponse.json({ ok: false, error: 'Nieprawidłowy kod' }, { status: 400 });
    }

    await prisma.verificationCode.update({
      where: { email },
      data: { consumed: true },
    });

    return NextResponse.json({ ok: true, passwordHash: rec.passwordHash });
  } catch (err: any) {
    console.error('[verify-code]', err);
    return NextResponse.json({ ok: false, error: 'Błąd serwera' }, { status: 500 });
  }
}
