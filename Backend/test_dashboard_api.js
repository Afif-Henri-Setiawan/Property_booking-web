const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hostId = "52413b77-9af5-494a-a7d3-914c2d05f9a8"; // juki

  const myProperties = await prisma.propertyStaff.findMany({
    where: { penggunaId: hostId, staffRole: 'MANAGER' },
    select: { propertiId: true }
  });
  
  const staffPropertyIds = myProperties.map(p => p.propertiId);

  const hostedProperties = await prisma.properti.findMany({
    where: { tuanRumahId: hostId },
    select: { id: true }
  });
  const hostedPropertyIds = hostedProperties.map(p => p.id);

  const propertyIds = [...new Set([...staffPropertyIds, ...hostedPropertyIds])];

  const properties = await prisma.properti.findMany({
    where: { id: { in: propertyIds } },
    include: {
      tipeKamar: {
        take: 1,
        orderBy: { hargaDasar: 'asc' }
      },
      _count: {
        select: { pemesanan: true }
      }
    }
  });

  const pemesananList = await prisma.pemesanan.findMany({
    where: {
      propertiId: { in: propertyIds },
      status: { in: ['DIKONFIRMASI', 'CHECK_IN', 'SELESAI'] }
    }
  });

  const totalBookings = await prisma.pemesanan.count({
    where: { propertiId: { in: propertyIds } }
  });

  const revenue = pemesananList.reduce((acc, curr) => acc + Number(curr.totalHarga), 0);

  const formattedProperties = properties.map(p => ({
    id: p.id,
    name: p.nama,
    status: p.status === 'DITERBITKAN' ? 'Dipublikasikan' : (p.status === 'DRAFT' ? 'Draft' : 'Tertunda'),
    price: p.tipeKamar[0] ? `Rp ${p.tipeKamar[0].hargaDasar.toString()}/malam` : 'Belum diatur',
    bookings: p._count.pemesanan
  }));

  console.log("Output:");
  console.log(JSON.stringify({
      totalProperties: propertyIds.length,
      totalBookings,
      revenue,
      properties: formattedProperties
  }, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
