import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

const fakerUser = (): any => ({
  name: faker.person.firstName() + faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

async function main() {
  const fakerRounds = 10;
  dotenv.config();
  console.log('Seeding...');
  for (let i = 0; i < fakerRounds; i++) {
    await prisma.user.create({ data: fakerUser() });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
