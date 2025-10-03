import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, passwordHash, client } = await req.json() as {
      email: string; passwordHash: string; client: any;
    };

    if (!email || !passwordHash) {
      return NextResponse.json({ ok: false, error: 'Brak zweryfikowanego hasła' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ ok:false, error:'Użytkownik już istnieje' }, { status:409 });

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role: 'CLIENT',
      },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok:false, error:'Błąd serwera' }, { status:500 });
  }
}
