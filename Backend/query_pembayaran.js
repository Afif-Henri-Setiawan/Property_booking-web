const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.pembayaran.findMany({
    where: { pemesananId: 'ac8d0a77-2c6a-4fa5-ae65-4a27cc1ae6b0' }
  });
  console.log(p);
  
  const pem = await prisma.pemesanan.findUnique({
    where: { id: 'ac8d0a77-2c6a-4fa5-ae65-4a27cc1ae6b0' }
  });
  console.log(pem);
}
main().catch(console.error).finally(() => prisma.$disconnect());
