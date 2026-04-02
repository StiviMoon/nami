import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.restaurant.updateMany({
    where: { status: 'PENDING' },
    data: {
      status: 'ACTIVE',
      reviewedAt: new Date(),
    },
  });

  console.log(`✅ ${result.count} restaurantes existentes marcados como ACTIVE`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
