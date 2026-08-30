const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pemesanan = await prisma.pemesanan.findMany({
    select: {
      id: true,
      tamuId: true,
      status: true,
      dibuatPada: true
    }
  });
  console.log(pemesanan);
}
main().catch(console.error).finally(() => prisma.$disconnect());
