const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pem = await prisma.pemesanan.findFirst({
    select: {
      id: true,
      kadaluarsaPada: true,
      dibuatPada: true
    }
  });
  console.log(pem);
}
main().catch(console.error).finally(() => prisma.$disconnect());
