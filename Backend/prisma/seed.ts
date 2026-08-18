import { PrismaClient, StatusProperti, StatusUnit, StatusPemesanan, TipeTamu, Peran } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  // Delete many to ensure a fresh start
  await prisma.pemesanan.deleteMany();
  await prisma.ulasan.deleteMany();
  await prisma.properti.deleteMany();
  await prisma.fasilitas.deleteMany();
  await prisma.tipeProperti.deleteMany();
  await prisma.tipeKasur.deleteMany();
  await prisma.pengguna.deleteMany();

  console.log('Seeding Pengguna...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.pengguna.create({
    data: { email: 'admin@staynest.com', nama: 'Admin StayNest', kataSandi: hashedPassword, peran: Peran.ADMIN }
  });

  const host1 = await prisma.pengguna.create({
    data: { email: 'sarah@host.com', nama: 'Sarah Jenkins', kataSandi: hashedPassword, peran: Peran.TUAN_RUMAH }
  });

  const host2 = await prisma.pengguna.create({
    data: { email: 'michael@host.com', nama: 'Michael Chen', kataSandi: hashedPassword, peran: Peran.TUAN_RUMAH }
  });

  const tamu = await prisma.pengguna.create({
    data: { email: 'john@guest.com', nama: 'John Doe', kataSandi: hashedPassword, peran: Peran.TAMU }
  });

  console.log('Seeding TipeProperti...');
  const typeVilla = await prisma.tipeProperti.create({ data: { nama: 'Villa', slug: 'villa' } });
  const typeResort = await prisma.tipeProperti.create({ data: { nama: 'Resort', slug: 'resort' } });
  const typeCabin = await prisma.tipeProperti.create({ data: { nama: 'Cabin', slug: 'cabin' } });

  console.log('Seeding Fasilitas...');
  const fasWifi = await prisma.fasilitas.create({ data: { nama: 'Fast Wi-Fi', ikon: 'wifi' } });
  const fasPool = await prisma.fasilitas.create({ data: { nama: 'Private Pool', ikon: 'pool' } });
  const fasKitchen = await prisma.fasilitas.create({ data: { nama: 'Chef Kitchen', ikon: 'kitchen' } });
  const fasParking = await prisma.fasilitas.create({ data: { nama: 'Free Parking', ikon: 'local_parking' } });

  console.log('Seeding TipeKasur...');
  const kingBed = await prisma.tipeKasur.create({ data: { nama: 'King Size', deskripsi: 'Extra large comfortable bed' } });
  const queenBed = await prisma.tipeKasur.create({ data: { nama: 'Queen Size', deskripsi: 'Large comfortable bed' } });

  console.log('Seeding Properti...');
  const prop1 = await prisma.properti.create({
    data: {
      tuanRumahId: host1.id,
      tipePropertiId: typeVilla.id,
      nama: 'The Grandview Residences',
      deskripsi: 'Experience unparalleled luxury in this stunning architectural masterpiece nestled in the heart of Aspen.',
      alamat: '123 Aspen Way',
      kota: 'Aspen',
      provinsi: 'Colorado',
      negara: 'United States',
      garisLintang: 39.1911,
      garisBujur: -106.8175,
      waktuCheckIn: '15:00',
      waktuCheckOut: '11:00',
      status: StatusProperti.DITERBITKAN,
      foto: {
        create: [
          { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcG-ZmIM3d7cgBdUX0EZafJHxhzNL9sP54C1PsSWNhozODJQF0Pgq7B9ETMUWORSyk4JU9c5b5rh2-_kwInzltgX7MwHOPO9v1i_8i8Z8vz2g-KzyBSP3JtjfaC8mcgstO0d2g1q7RhhhaQdLbsAnMJrihmFaLZ_qTntt4tiPfJdKTHA9w8QS0cRPW0J9hnfT5l4TaozikDu4Mhmlv_rgub5Dxo0jZ-9norEAeRMbf3WLx5_kB5riq', isUtama: true },
          { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD55cSx6OHwrK415WRfmVhXj0WYF93Xf1GR6dWc7I5hQTLe5G9St9MpgwwXsuNZh4CaJYaH28O8y8crogRYPkJ3jxHUgvfsQeem39AFC0tuswJ9dHxEAagT6OP9PtbDLGlbjWVPCaK516bjc159XRu9AAuEF1SeoXF83gRPxOIbwrT7jEF0jg34zmFS0OeFST89Af8IkH97ohjQINX04_eAKBDH9FQBkMdZcTcUpcCTo5e6kRAJn1M1', isUtama: false }
        ]
      },
      fasilitas: {
        create: [
          { fasilitasId: fasWifi.id },
          { fasilitasId: fasPool.id },
          { fasilitasId: fasKitchen.id }
        ]
      }
    }
  });

  const prop2 = await prisma.properti.create({
    data: {
      tuanRumahId: host2.id,
      tipePropertiId: typeResort.id,
      nama: 'Royal Crest Manor',
      deskripsi: 'Our family vacation at Royal Crest Manor was unforgettable.',
      alamat: '456 Beverly Dr',
      kota: 'Beverly Hills',
      provinsi: 'CA',
      negara: 'United States',
      status: StatusProperti.DITERBITKAN,
      foto: {
        create: [
          { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlF5FaTbVHJhzIZUrhKz2MlGW-EhNc2mpoLXUsXjvvgIKkuIxlE2vDYmU-NX18rz3tTFu-I3YIOv_F7wQYImdBrcC51D621ABxuhDNVi4DDhmNEL2L7Sy2BaaDfvjHFkuGlfmVxHmFYcW3lUCvgNjuiz-mmtp5WEoRUQq_7KyDRDW007_WtlE4bAbdqNYeu4BlBZp4v9CXphbwknbkVIBCgx4IkwIuRvWPSoNRaa5yRXextb_HfK8Q', isUtama: true }
        ]
      },
      fasilitas: {
        create: [
          { fasilitasId: fasWifi.id },
          { fasilitasId: fasParking.id }
        ]
      }
    }
  });

  const prop3 = await prisma.properti.create({
    data: {
      tuanRumahId: host1.id,
      tipePropertiId: typeCabin.id,
      nama: 'Opulence Gardens',
      deskripsi: 'Experience the Swiss Alps in pure opulence.',
      alamat: '789 Alpine Way',
      kota: 'Zermatt',
      provinsi: 'Valais',
      negara: 'Switzerland',
      status: StatusProperti.DITERBITKAN,
      foto: {
        create: [
          { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy3Ps_CdX2BN15cVk11qpxXxWNqfx1ovXW3n7BAsV2Kj5UIB8PJ6tp_o_TN3FaV6I-hlMVGaZW1Hlc-5Ery-PgRSoGPiusalxxlUSc_d43ScEV_-mq00P-PR5QaDvTbICy3C4E1fwsFmR41I08OjomlSZFxV3ImT55aX7CtbPMrLJ3pdaBf-Wx3aUN5YuNb77E7MhkNmGCrjlz7jkm_xdLWjE2JzNBJ77rpT9--uMO5P7ClsPOV7Wr', isUtama: true }
        ]
      }
    }
  });

  console.log('Seeding TipeKamar and related...');
  const roomType1 = await prisma.tipeKamar.create({
    data: {
      propertiId: prop1.id,
      nama: 'Master Suite',
      hargaDasar: 4500000.00,
      maksDewasa: 2,
      maksAnak: 2,
      maksTamu: 4,
      totalUnit: 1,
      kasur: {
        create: [
          { tipeKasurId: kingBed.id, jumlah: 1 }
        ]
      },
      paketHarga: {
        create: [
          { nama: 'Standard Rate', harga: 4500000.00 }
        ]
      },
      unit: {
        create: [
          { nomorUnit: '101A' }
        ]
      }
    },
    include: {
      paketHarga: true,
      unit: true
    }
  });

  const roomType2 = await prisma.tipeKamar.create({
    data: {
      propertiId: prop2.id,
      nama: 'Deluxe Room',
      hargaDasar: 7500000.00,
      maksDewasa: 2,
      maksAnak: 1,
      maksTamu: 3,
      totalUnit: 2,
      kasur: {
        create: [
          { tipeKasurId: queenBed.id, jumlah: 1 }
        ]
      },
      paketHarga: {
        create: [
          { nama: 'Standard Rate', harga: 7500000.00 }
        ]
      },
      unit: {
        create: [
          { nomorUnit: '201B' },
          { nomorUnit: '202B' }
        ]
      }
    }
  });

  const roomType3 = await prisma.tipeKamar.create({
    data: {
      propertiId: prop3.id,
      nama: 'Cozy Cabin Room',
      hargaDasar: 3500000.00,
      maksDewasa: 2,
      maksAnak: 0,
      maksTamu: 2,
      totalUnit: 1,
      kasur: {
        create: [
          { tipeKasurId: queenBed.id, jumlah: 1 }
        ]
      },
      paketHarga: {
        create: [
          { nama: 'Standard Rate', harga: 3500000.00 }
        ]
      },
      unit: {
        create: [
          { nomorUnit: '301C' }
        ]
      }
    }
  });

  console.log('Seeding Pemesanan, Pembayaran, CheckIn, Ulasan...');
  const pemesanan = await prisma.pemesanan.create({
    data: {
      nomorPemesanan: 'ORD-12345',
      tamuId: tamu.id,
      propertiId: prop1.id,
      tipeKamarId: roomType1.id,
      unitKamarId: roomType1.unit[0].id,
      paketHargaId: roomType1.paketHarga[0].id,
      waktuCheckIn: new Date(new Date().getTime() + 86400000), // tomorrow
      waktuCheckOut: new Date(new Date().getTime() + 86400000 * 3), // +3 days
      dewasa: 2,
      jumlahKamar: 1,
      jumlahMalam: 2,
      subtotal: 9000000.00,
      biayaLayanan: 1000000.00,
      pajak: 500000.00,
      totalHarga: 10500000.00,
      status: StatusPemesanan.DIKONFIRMASI,
      tamuPemesanan: {
        create: [
          { nama: 'John Doe', tipeTamu: TipeTamu.DEWASA }
        ]
      },
      pembayaran: {
        create: {
          jumlah: 10500000.00,
          metodePembayaran: 'CREDIT_CARD',
          statusTransaksi: 'settlement'
        }
      },
      dataCheckIn: {
        create: {
          unitKamarId: roomType1.unit[0].id
        }
      }
    }
  });

  await prisma.ulasan.create({
    data: {
      propertiId: prop1.id,
      penggunaId: tamu.id,
      pemesananId: pemesanan.id,
      penilaian: 5,
      komentar: 'The villa in Aspen exceeded all our expectations. The booking process was seamless.'
    }
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
