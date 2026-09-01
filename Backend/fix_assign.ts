import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const details = await prisma.detailPemesanan.findMany({
    where: { unitKamarId: null, pemesanan: { status: 'CHECK_IN' } },
    include: { pemesanan: true }
  });

  for (const detail of details) {
    const availableUnits = await prisma.unitKamar.findMany({
      where: { tipeKamarId: detail.tipeKamarId, status: 'TERSEDIA' },
      take: 1
    });

    if (availableUnits.length > 0) {
      const assignedUnit = availableUnits[0];
      await prisma.detailPemesanan.update({
        where: { id: detail.id },
        data: { unitKamarId: assignedUnit.id }
      });
      await prisma.checkIn.create({
        data: {
          pemesananId: detail.pemesananId,
          unitKamarId: assignedUnit.id,
          discanOleh: 'System Fix'
        }
      });
      await prisma.unitKamar.update({
        where: { id: assignedUnit.id },
        data: { status: 'TERISI' }
      });
      console.log(`Assigned room ${assignedUnit.id} to detail ${detail.id}`);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
