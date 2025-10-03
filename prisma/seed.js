// prisma/seed.js
const { PrismaClient, Role, DayOfWeek } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // Usługodawca (Kasia)
  const userProv = await prisma.user.upsert({
    where: { email: 'kasia@demo.pl' },
    update: {},
    create: { email: 'kasia@demo.pl', role: Role.PROVIDER },
  });

  const profile = await prisma.providerProfile.upsert({
    where: { userId: userProv.id },
    update: {},
    create: {
      userId: userProv.id,
      name: 'Kasia Sprzątająca',
      city: 'Warszawa',
      street: 'Prosta 1',
      avatarUrl: 'https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=200&q=80',
      bio: 'Dokładne sprzątanie mieszkań i domów. Dojazd w granicach miasta.',
      travelCost: 10,
      calcClientRoute: true,
      gallery: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
        'https://images.unsplash.com/photo-1584624272811-5b1b86c5f1f7?w=800&q=80',
      ],
      services: {
        create: [
          { name: 'Sprzątanie',        pricePerHour: 55 },
          { name: 'Pranie/Prasowanie', pricePerHour: 45 },
          { name: 'Mycie okien',       pricePerHour: 60 },
        ],
      },
      availability: {
        create: [
          { day: DayOfWeek.MON, timeRanges: ['08:00-16:00'] },
          { day: DayOfWeek.TUE, timeRanges: ['08:00-16:00'] },
          { day: DayOfWeek.WED, timeRanges: ['08:00-16:00'] },
          { day: DayOfWeek.THU, timeRanges: ['08:00-16:00'] },
          { day: DayOfWeek.FRI, timeRanges: ['08:00-16:00'] },
        ],
      },
    },
    include: { services: true },
  });

  // Klient (Anna)
  const client = await prisma.user.upsert({
    where: { email: 'anna@demo.pl' },
    update: {},
    create: { email: 'anna@demo.pl', role: Role.CLIENT },
  });

  // Demo zlecenie
  await prisma.order.create({
    data: {
      clientId: client.id,
      providerId: profile.id,
      serviceId: profile.services[0].id,
      hours: 3,
      city: 'Warszawa',
      street: 'Złota 10',
    },
  });

  console.log('✅ Seed OK');
}

run()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
