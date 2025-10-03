import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationCode } from '@/lib/mailer';
import { hashPassword } from '@/lib/hash';

export const runtime = 'nodejs';

function generateCode() {
  return (Math.floor(100000 + Math.random() * 900000)).toString(); // 6 cyfr
}

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json() as { email:string; password:string; role:'provider'|'client' };
    if (!email || !password) return NextResponse.json({ ok:false, error:'Email i hasło są wymagane' }, { status:400 });

    // nie pozwól na duplikat użytkownika
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ ok:false, error:'Użytkownik już istnieje' }, { status:409 });

    const code = generateCode();
    const passwordHash = await hashPassword(password);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // zapisz/aktualizuj rekord
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code, passwordHash, role: role === 'provider' ? 'PROVIDER' : 'CLIENT', expiresAt, consumed:false },
      create: { email, code, passwordHash, role: role === 'provider' ? 'PROVIDER' : 'CLIENT', expiresAt },
    });

    await sendVerificationCode(email, code);
    return NextResponse.json({ ok:true });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ ok:false, error:'Błąd serwera' }, { status:500 });
  }
}
