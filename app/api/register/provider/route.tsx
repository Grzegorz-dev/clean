import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, passwordHash, profile } = await req.json();

    if (!email || !passwordHash) {
      return NextResponse.json({ ok:false, error:'Brak zweryfikowanego hasła' }, { status:400 });
    }
    if (!profile?.name || !profile?.city) {
      return NextResponse.json({ ok:false, error:'Nazwa i miasto są wymagane' }, { status:400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ ok:false, error:'Użytkownik już istnieje' }, { status:409 });

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role: 'PROVIDER',
        providerProfile: {
          create: {
            name: profile.name,
            phone: profile.phone ?? null,
            city: profile.city,
            street: profile.street ?? null,
            country: profile.country ?? 'Polska',
            avatarUrl: profile.avatarUrl ?? null,
            bio: profile.bio ?? null,
            travelCost: Number(profile.travelCost ?? 0),
            calcClientRoute: !!profile.calcClientRoute,
            gallery: Array.isArray(profile.gallery) ? profile.gallery : [],
            services: {
              create: (Array.isArray(profile.services) ? profile.services : []).map((s: any) => ({
                name: s.name || 'Usługa',
                pricePerHour: Number(s.pricePerHour || 0),
              })),
            },
          },
        },
      },
      include: { providerProfile: { include: { services: true } } },
    });

    return NextResponse.json({ ok:true, userId: user.id, providerId: user.providerProfile?.id });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ ok:false, error:'Błąd serwera' }, { status:500 });
  }
}

