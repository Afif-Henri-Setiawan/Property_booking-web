-- CreateEnum
CREATE TYPE "StatusTipeKamar" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "StatusPaketHarga" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "StatusPemesanan" AS ENUM ('MENUNGGU_PEMBAYARAN', 'PEMBAYARAN', 'DIKONFIRMASI', 'CHECK_IN', 'SELESAI', 'DIBATALKAN', 'KADALUARSA', 'DIKEMBALIKAN');

-- CreateEnum
CREATE TYPE "TipeTamu" AS ENUM ('DEWASA', 'ANAK', 'BAYI');

-- CreateEnum
CREATE TYPE "Peran" AS ENUM ('TAMU', 'TUAN_RUMAH', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusProperti" AS ENUM ('DRAFT', 'TERTUNDA', 'DITERBITKAN', 'DITOLAK', 'NONAKTIF', 'DITANGGUHKAN');

-- CreateEnum
CREATE TYPE "StatusUnit" AS ENUM ('TERSEDIA', 'TERISI', 'PERAWATAN', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "StatusBlokir" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateTable
CREATE TABLE "TipeKamar" (
    "id" TEXT NOT NULL,
    "propertiId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "hargaDasar" DECIMAL(12,2) NOT NULL,
    "maksDewasa" INTEGER NOT NULL,
    "maksAnak" INTEGER NOT NULL,
    "maksTamu" INTEGER NOT NULL,
    "ukuranKamar" INTEGER,
    "totalUnit" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusTipeKamar" NOT NULL DEFAULT 'AKTIF',
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipeKamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoTipeKamar" (
    "id" TEXT NOT NULL,
    "tipeKamarId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isUtama" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FotoTipeKamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FasilitasTipeKamar" (
    "tipeKamarId" TEXT NOT NULL,
    "fasilitasId" TEXT NOT NULL,

    CONSTRAINT "FasilitasTipeKamar_pkey" PRIMARY KEY ("tipeKamarId","fasilitasId")
);

-- CreateTable
CREATE TABLE "TipeKasur" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "TipeKasur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KasurTipeKamar" (
    "id" TEXT NOT NULL,
    "tipeKamarId" TEXT NOT NULL,
    "tipeKasurId" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "KasurTipeKamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaketHarga" (
    "id" TEXT NOT NULL,
    "tipeKamarId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "harga" DECIMAL(12,2) NOT NULL,
    "termasukSarapan" BOOLEAN NOT NULL DEFAULT false,
    "dapatDikembalikan" BOOLEAN NOT NULL DEFAULT true,
    "kebijakanPembatalan" TEXT,
    "status" "StatusPaketHarga" NOT NULL DEFAULT 'AKTIF',
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaketHarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" TEXT NOT NULL,
    "pemesananId" TEXT NOT NULL,
    "orderIdMidtrans" TEXT,
    "transaksiIdMidtrans" TEXT,
    "referensiPembayaran" TEXT,
    "jumlah" DECIMAL(12,2) NOT NULL,
    "metodePembayaran" TEXT,
    "statusTransaksi" TEXT,
    "statusPenipuan" TEXT,
    "dibayarPada" TIMESTAMP(3),
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pemesanan" (
    "id" TEXT NOT NULL,
    "nomorPemesanan" TEXT NOT NULL,
    "tamuId" TEXT NOT NULL,
    "propertiId" TEXT NOT NULL,
    "tipeKamarId" TEXT NOT NULL,
    "unitKamarId" TEXT,
    "paketHargaId" TEXT NOT NULL,
    "waktuCheckIn" TIMESTAMP(3) NOT NULL,
    "waktuCheckOut" TIMESTAMP(3) NOT NULL,
    "dewasa" INTEGER NOT NULL,
    "anak" INTEGER NOT NULL DEFAULT 0,
    "bayi" INTEGER NOT NULL DEFAULT 0,
    "jumlahKamar" INTEGER NOT NULL DEFAULT 1,
    "jumlahMalam" INTEGER NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "biayaLayanan" DECIMAL(12,2) NOT NULL,
    "pajak" DECIMAL(12,2) NOT NULL,
    "diskon" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalHarga" DECIMAL(12,2) NOT NULL,
    "status" "StatusPemesanan" NOT NULL DEFAULT 'MENUNGGU_PEMBAYARAN',
    "kadaluarsaPada" TIMESTAMP(3),
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pemesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TamuPemesanan" (
    "id" TEXT NOT NULL,
    "pemesananId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT,
    "telepon" TEXT,
    "tipeTamu" "TipeTamu" NOT NULL DEFAULT 'DEWASA',

    CONSTRAINT "TamuPemesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "pemesananId" TEXT NOT NULL,
    "unitKamarId" TEXT NOT NULL,
    "discanOleh" TEXT,
    "waktuCheckIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengguna" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kataSandi" TEXT NOT NULL,
    "peran" "Peran" NOT NULL DEFAULT 'TAMU',
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Properti" (
    "id" TEXT NOT NULL,
    "tuanRumahId" TEXT NOT NULL,
    "tipePropertiId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kota" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "negara" TEXT NOT NULL,
    "garisLintang" DOUBLE PRECISION,
    "garisBujur" DOUBLE PRECISION,
    "waktuCheckIn" TEXT,
    "waktuCheckOut" TEXT,
    "status" "StatusProperti" NOT NULL DEFAULT 'DRAFT',
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Properti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipeProperti" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "TipeProperti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fasilitas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "ikon" TEXT,

    CONSTRAINT "Fasilitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FasilitasProperti" (
    "propertiId" TEXT NOT NULL,
    "fasilitasId" TEXT NOT NULL,

    CONSTRAINT "FasilitasProperti_pkey" PRIMARY KEY ("propertiId","fasilitasId")
);

-- CreateTable
CREATE TABLE "FotoProperti" (
    "id" TEXT NOT NULL,
    "propertiId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isUtama" BOOLEAN NOT NULL DEFAULT false,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoProperti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ulasan" (
    "id" TEXT NOT NULL,
    "propertiId" TEXT NOT NULL,
    "penggunaId" TEXT NOT NULL,
    "pemesananId" TEXT NOT NULL,
    "penilaian" SMALLINT NOT NULL,
    "komentar" TEXT,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ulasan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitKamar" (
    "id" TEXT NOT NULL,
    "tipeKamarId" TEXT NOT NULL,
    "nomorUnit" TEXT NOT NULL,
    "lantai" TEXT,
    "status" "StatusUnit" NOT NULL DEFAULT 'TERSEDIA',
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbaruiPada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitKamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlokirKetersediaan" (
    "id" TEXT NOT NULL,
    "unitKamarId" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "alasan" TEXT,
    "status" "StatusBlokir" NOT NULL DEFAULT 'AKTIF',
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlokirKetersediaan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pembayaran_pemesananId_key" ON "Pembayaran"("pemesananId");

-- CreateIndex
CREATE UNIQUE INDEX "Pembayaran_orderIdMidtrans_key" ON "Pembayaran"("orderIdMidtrans");

-- CreateIndex
CREATE UNIQUE INDEX "Pembayaran_transaksiIdMidtrans_key" ON "Pembayaran"("transaksiIdMidtrans");

-- CreateIndex
CREATE UNIQUE INDEX "Pemesanan_nomorPemesanan_key" ON "Pemesanan"("nomorPemesanan");

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_pemesananId_key" ON "CheckIn"("pemesananId");

-- CreateIndex
CREATE UNIQUE INDEX "Pengguna_email_key" ON "Pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TipeProperti_slug_key" ON "TipeProperti"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ulasan_pemesananId_key" ON "Ulasan"("pemesananId");

-- AddForeignKey
ALTER TABLE "TipeKamar" ADD CONSTRAINT "TipeKamar_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES "Properti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoTipeKamar" ADD CONSTRAINT "FotoTipeKamar_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES "TipeKamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FasilitasTipeKamar" ADD CONSTRAINT "FasilitasTipeKamar_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES "TipeKamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FasilitasTipeKamar" ADD CONSTRAINT "FasilitasTipeKamar_fasilitasId_fkey" FOREIGN KEY ("fasilitasId") REFERENCES "Fasilitas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KasurTipeKamar" ADD CONSTRAINT "KasurTipeKamar_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES "TipeKamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KasurTipeKamar" ADD CONSTRAINT "KasurTipeKamar_tipeKasurId_fkey" FOREIGN KEY ("tipeKasurId") REFERENCES "TipeKasur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaketHarga" ADD CONSTRAINT "PaketHarga_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES "TipeKamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES "Pemesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemesanan" ADD CONSTRAINT "Pemesanan_tamuId_fkey" FOREIGN KEY ("tamuId") REFERENCES "Pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemesanan" ADD CONSTRAINT "Pemesanan_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES "Properti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemesanan" ADD CONSTRAINT "Pemesanan_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES "TipeKamar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemesanan" ADD CONSTRAINT "Pemesanan_unitKamarId_fkey" FOREIGN KEY ("unitKamarId") REFERENCES "UnitKamar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemesanan" ADD CONSTRAINT "Pemesanan_paketHargaId_fkey" FOREIGN KEY ("paketHargaId") REFERENCES "PaketHarga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TamuPemesanan" ADD CONSTRAINT "TamuPemesanan_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES "Pemesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES "Pemesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_unitKamarId_fkey" FOREIGN KEY ("unitKamarId") REFERENCES "UnitKamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Properti" ADD CONSTRAINT "Properti_tuanRumahId_fkey" FOREIGN KEY ("tuanRumahId") REFERENCES "Pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Properti" ADD CONSTRAINT "Properti_tipePropertiId_fkey" FOREIGN KEY ("tipePropertiId") REFERENCES "TipeProperti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FasilitasProperti" ADD CONSTRAINT "FasilitasProperti_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES "Properti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FasilitasProperti" ADD CONSTRAINT "FasilitasProperti_fasilitasId_fkey" FOREIGN KEY ("fasilitasId") REFERENCES "Fasilitas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoProperti" ADD CONSTRAINT "FotoProperti_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES "Properti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES "Properti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_penggunaId_fkey" FOREIGN KEY ("penggunaId") REFERENCES "Pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES "Pemesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitKamar" ADD CONSTRAINT "UnitKamar_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES "TipeKamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlokirKetersediaan" ADD CONSTRAINT "BlokirKetersediaan_unitKamarId_fkey" FOREIGN KEY ("unitKamarId") REFERENCES "UnitKamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
