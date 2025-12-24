import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Mobile Providers
  const providers = [
    {
      code: 'VIETTEL',
      name: 'Viettel',
      logo: 'phone',
      denominations: JSON.stringify([10000, 20000, 50000, 100000, 200000, 500000]),
      serviceFee: 0,
    },
    {
      code: 'MOBIFONE',
      name: 'MobiFone',
      logo: 'smartphone',
      denominations: JSON.stringify([10000, 20000, 50000, 100000, 200000, 500000]),
      serviceFee: 0,
    },
    {
      code: 'VINAPHONE',
      name: 'VinaPhone',
      logo: 'phone-call',
      denominations: JSON.stringify([10000, 20000, 50000, 100000, 200000, 500000]),
      serviceFee: 0,
    },
    {
      code: 'VIETNAMOBILE',
      name: 'Vietnamobile',
      logo: 'smartphone',
      denominations: JSON.stringify([10000, 20000, 50000, 100000, 200000, 300000]),
      serviceFee: 0,
    },
    {
      code: 'GMOBILE',
      name: 'Gmobile',
      logo: 'phone',
      denominations: JSON.stringify([10000, 20000, 50000, 100000, 200000]),
      serviceFee: 0,
    },
  ];

  for (const provider of providers) {
    await prisma.mobileProvider.upsert({
      where: { code: provider.code },
      update: {},
      create: provider,
    });
  }

  console.log('✅ Mobile providers seeded');

  // Seed Deposit Locations (Planets)
  const planets = [
    {
      planetName: 'Sao Hỏa',
      planetCode: 'MARS',
      description: 'Hành tinh đỏ - Trung tâm thương mại vũ trụ',
      color: '#FF6B6B',
      icon: 'planet',
      depositPoints: 8,
      isActive: true,
    },
    {
      planetName: 'Sao Kim',
      planetCode: 'VENUS',
      description: 'Hành tinh của tình yêu - Khu mua sắm cao cấp',
      color: '#FFD93D',
      icon: 'sparkles',
      depositPoints: 6,
      isActive: true,
    },
    {
      planetName: 'Sao Mộc',
      planetCode: 'JUPITER',
      description: 'Gã khổng lồ khí - Trạm nạp năng lượng lớn nhất',
      color: '#FFA94D',
      icon: 'zap',
      depositPoints: 12,
      isActive: true,
    },
    {
      planetName: 'Sao Thổ',
      planetCode: 'SATURN',
      description: 'Chúa tể của những chiếc nhẫn - Trung tâm tài chính',
      color: '#C69749',
      icon: 'circle',
      depositPoints: 10,
      isActive: true,
    },
    {
      planetName: 'Sao Thiên Vương',
      planetCode: 'URANUS',
      description: 'Hành tinh xanh - Khu công nghệ tiên tiến',
      color: '#4FC3F7',
      icon: 'globe',
      depositPoints: 7,
      isActive: true,
    },
    {
      planetName: 'Sao Hải Vương',
      planetCode: 'NEPTUNE',
      description: 'Hành tinh xanh thẫm - Trạm nạp đại dương vũ trụ',
      color: '#2E5090',
      icon: 'waves',
      depositPoints: 9,
      isActive: true,
    },
    {
      planetName: 'Trái Đất',
      planetCode: 'EARTH',
      description: 'Hành tinh xanh - Quê hương của chúng ta',
      color: '#4CAF50',
      icon: 'home',
      depositPoints: 15,
      isActive: true,
    },
    {
      planetName: 'Sao Thủy',
      planetCode: 'MERCURY',
      description: 'Hành tinh nhanh nhất - Giao dịch tốc độ cao',
      color: '#9E9E9E',
      icon: 'rocket',
      depositPoints: 5,
      isActive: true,
    },
  ];

  for (const planet of planets) {
    await prisma.depositLocation.upsert({
      where: { planetCode: planet.planetCode },
      update: {},
      create: planet,
    });
  }

  console.log('✅ Deposit locations (planets) seeded');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
