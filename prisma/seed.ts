import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

const fakeStats = (): any => ({
  experience_point: faker.number.int({ min: 1000, max: 2000 }),
  coins: faker.number.int({ min: 200, max: 500 }),
  games_played: faker.number.int({ min: 30, max: 50 }),
  games_won: faker.number.int({ min: 10, max: 25 }),
});
const fakerUser = (): any => ({
  name: faker.person.firstName() + faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

async function main() {
  const fakerRounds = 100;
  dotenv.config();
  console.log('Seeding...');
  for (let i = 0; i < fakerRounds; i++) {
    const stats = await prisma.statistics.create({ data: fakeStats() });

    await prisma.player.create({
      data: { ...fakerUser(), statistics: { connect: { id: stats.id } } },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
