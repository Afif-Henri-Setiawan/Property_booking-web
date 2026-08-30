const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tamuId = '6faaa57a-e2fb-4f26-9d6b-466e28d64f2e';
  const pemesanan = await prisma.pemesanan.findMany({
    where: { tamuId },
    orderBy: { dibuatPada: 'desc' },
    include: {
      properti: { select: { nama: true, kota: true } },
      detail: { include: { tipeKamar: { select: { nama: true } } } }
    }
  });
  console.log(pemesanan);
}
main().catch(console.error).finally(() => prisma.$disconnect());
