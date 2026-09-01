import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const details = await prisma.detailPemesanan.findMany({
    where: { jumlahKamar: { gt: 1 } }
  });

  for (const detail of details) {
    console.log(`Fixing detail ${detail.id} with ${detail.jumlahKamar} rooms`);
    
    // Update original to 1
    const newSubtotal = detail.hargaSatuan.mul(detail.pemesananId ? (await prisma.pemesanan.findUnique({where: {id: detail.pemesananId}}).then(p => {
       const diff = new Date(p!.waktuCheckOut).getTime() - new Date(p!.waktuCheckIn).getTime();
       return Math.ceil(diff / (1000 * 3600 * 24));
    }) || 1) : 1);
    
    // Wait, let's just copy the old logic: subtotal / jumlahKamar
    const perRoomSubtotal = Number(detail.subtotal) / detail.jumlahKamar;

    await prisma.detailPemesanan.update({
      where: { id: detail.id },
      data: { jumlahKamar: 1, subtotal: perRoomSubtotal }
    });

    // Create the rest
    for (let i = 1; i < detail.jumlahKamar; i++) {
      await prisma.detailPemesanan.create({
        data: {
          pemesananId: detail.pemesananId,
          tipeKamarId: detail.tipeKamarId,
          unitKamarId: null, // it will be allocated next checkin
          paketHargaId: detail.paketHargaId,
          jumlahKamar: 1,
          hargaSatuan: detail.hargaSatuan,
          subtotal: perRoomSubtotal
        }
      });
    }
  }
  console.log('Done');
}
main().catch(console.error).finally(() => prisma.$disconnect());
