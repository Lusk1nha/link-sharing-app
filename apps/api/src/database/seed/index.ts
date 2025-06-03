import { PrismaClient } from "@prisma/client";

let prisma;

async function main() {
  prisma = new PrismaClient();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
