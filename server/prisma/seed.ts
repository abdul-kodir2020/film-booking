import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user1 = await prisma.user.upsert({
        where: { email: 'sabin@adams.com' },
        update: {},
        create: {
          email: 'sabin@adams.com',
          name: 'Sabin Adams',
          password: 'password-sabin',
        },
    });
    
    const user2 = await prisma.user.upsert({
        where: { email: 'alex@ruheni.com' },
        update: {},
        create: {
          email: 'alex@ruheni.com',
          name: 'Alex Ruheni',
          password: 'password-alex',
        },
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });