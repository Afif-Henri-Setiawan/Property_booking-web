--
-- PostgreSQL database dump
--

\restrict dcfOzD4U4IFkjhNTo8CsnzKaRXxhE7ZnHgRSkEimdrsTFoGExkGKqyeuGarKiI9

-- Dumped from database version 18.4 (Ubuntu 18.4-1.pgdg24.04+1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public."UnitKamar" DROP CONSTRAINT "UnitKamar_tipeKamarId_fkey";
ALTER TABLE ONLY public."Ulasan" DROP CONSTRAINT "Ulasan_propertiId_fkey";
ALTER TABLE ONLY public."Ulasan" DROP CONSTRAINT "Ulasan_penggunaId_fkey";
ALTER TABLE ONLY public."Ulasan" DROP CONSTRAINT "Ulasan_pemesananId_fkey";
ALTER TABLE ONLY public."TipeKamar" DROP CONSTRAINT "TipeKamar_propertiId_fkey";
ALTER TABLE ONLY public."TamuPemesanan" DROP CONSTRAINT "TamuPemesanan_pemesananId_fkey";
ALTER TABLE ONLY public."Properti" DROP CONSTRAINT "Properti_tuanRumahId_fkey";
ALTER TABLE ONLY public."Properti" DROP CONSTRAINT "Properti_tipePropertiId_fkey";
ALTER TABLE ONLY public."Pemesanan" DROP CONSTRAINT "Pemesanan_tamuId_fkey";
ALTER TABLE ONLY public."Pemesanan" DROP CONSTRAINT "Pemesanan_propertiId_fkey";
ALTER TABLE ONLY public."Pembayaran" DROP CONSTRAINT "Pembayaran_pemesananId_fkey";
ALTER TABLE ONLY public."PaketHarga" DROP CONSTRAINT "PaketHarga_tipeKamarId_fkey";
ALTER TABLE ONLY public."KasurTipeKamar" DROP CONSTRAINT "KasurTipeKamar_tipeKasurId_fkey";
ALTER TABLE ONLY public."KasurTipeKamar" DROP CONSTRAINT "KasurTipeKamar_tipeKamarId_fkey";
ALTER TABLE ONLY public."FotoTipeKamar" DROP CONSTRAINT "FotoTipeKamar_tipeKamarId_fkey";
ALTER TABLE ONLY public."FotoProperti" DROP CONSTRAINT "FotoProperti_propertiId_fkey";
ALTER TABLE ONLY public."FasilitasTipeKamar" DROP CONSTRAINT "FasilitasTipeKamar_tipeKamarId_fkey";
ALTER TABLE ONLY public."FasilitasTipeKamar" DROP CONSTRAINT "FasilitasTipeKamar_fasilitasId_fkey";
ALTER TABLE ONLY public."FasilitasProperti" DROP CONSTRAINT "FasilitasProperti_propertiId_fkey";
ALTER TABLE ONLY public."FasilitasProperti" DROP CONSTRAINT "FasilitasProperti_fasilitasId_fkey";
ALTER TABLE ONLY public."DetailPemesanan" DROP CONSTRAINT "DetailPemesanan_unitKamarId_fkey";
ALTER TABLE ONLY public."DetailPemesanan" DROP CONSTRAINT "DetailPemesanan_tipeKamarId_fkey";
ALTER TABLE ONLY public."DetailPemesanan" DROP CONSTRAINT "DetailPemesanan_pemesananId_fkey";
ALTER TABLE ONLY public."DetailPemesanan" DROP CONSTRAINT "DetailPemesanan_paketHargaId_fkey";
ALTER TABLE ONLY public."CheckIn" DROP CONSTRAINT "CheckIn_unitKamarId_fkey";
ALTER TABLE ONLY public."CheckIn" DROP CONSTRAINT "CheckIn_pemesananId_fkey";
ALTER TABLE ONLY public."BlokirKetersediaan" DROP CONSTRAINT "BlokirKetersediaan_unitKamarId_fkey";
DROP INDEX public."Ulasan_pemesananId_key";
DROP INDEX public."TipeProperti_slug_key";
DROP INDEX public."Pengguna_email_key";
DROP INDEX public."Pemesanan_nomorPemesanan_key";
DROP INDEX public."Pembayaran_transaksiIdMidtrans_key";
DROP INDEX public."Pembayaran_pemesananId_key";
DROP INDEX public."Pembayaran_orderIdMidtrans_key";
ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
ALTER TABLE ONLY public."UnitKamar" DROP CONSTRAINT "UnitKamar_pkey";
ALTER TABLE ONLY public."Ulasan" DROP CONSTRAINT "Ulasan_pkey";
ALTER TABLE ONLY public."TipeProperti" DROP CONSTRAINT "TipeProperti_pkey";
ALTER TABLE ONLY public."TipeKasur" DROP CONSTRAINT "TipeKasur_pkey";
ALTER TABLE ONLY public."TipeKamar" DROP CONSTRAINT "TipeKamar_pkey";
ALTER TABLE ONLY public."TamuPemesanan" DROP CONSTRAINT "TamuPemesanan_pkey";
ALTER TABLE ONLY public."Properti" DROP CONSTRAINT "Properti_pkey";
ALTER TABLE ONLY public."Pengguna" DROP CONSTRAINT "Pengguna_pkey";
ALTER TABLE ONLY public."Pemesanan" DROP CONSTRAINT "Pemesanan_pkey";
ALTER TABLE ONLY public."Pembayaran" DROP CONSTRAINT "Pembayaran_pkey";
ALTER TABLE ONLY public."PaketHarga" DROP CONSTRAINT "PaketHarga_pkey";
ALTER TABLE ONLY public."KasurTipeKamar" DROP CONSTRAINT "KasurTipeKamar_pkey";
ALTER TABLE ONLY public."FotoTipeKamar" DROP CONSTRAINT "FotoTipeKamar_pkey";
ALTER TABLE ONLY public."FotoProperti" DROP CONSTRAINT "FotoProperti_pkey";
ALTER TABLE ONLY public."Fasilitas" DROP CONSTRAINT "Fasilitas_pkey";
ALTER TABLE ONLY public."FasilitasTipeKamar" DROP CONSTRAINT "FasilitasTipeKamar_pkey";
ALTER TABLE ONLY public."FasilitasProperti" DROP CONSTRAINT "FasilitasProperti_pkey";
ALTER TABLE ONLY public."DetailPemesanan" DROP CONSTRAINT "DetailPemesanan_pkey";
ALTER TABLE ONLY public."CheckIn" DROP CONSTRAINT "CheckIn_pkey";
ALTER TABLE ONLY public."BlokirKetersediaan" DROP CONSTRAINT "BlokirKetersediaan_pkey";
DROP TABLE public._prisma_migrations;
DROP TABLE public."UnitKamar";
DROP TABLE public."Ulasan";
DROP TABLE public."TipeProperti";
DROP TABLE public."TipeKasur";
DROP TABLE public."TipeKamar";
DROP TABLE public."TamuPemesanan";
DROP TABLE public."Properti";
DROP TABLE public."Pengguna";
DROP TABLE public."Pemesanan";
DROP TABLE public."Pembayaran";
DROP TABLE public."PaketHarga";
DROP TABLE public."KasurTipeKamar";
DROP TABLE public."FotoTipeKamar";
DROP TABLE public."FotoProperti";
DROP TABLE public."FasilitasTipeKamar";
DROP TABLE public."FasilitasProperti";
DROP TABLE public."Fasilitas";
DROP TABLE public."DetailPemesanan";
DROP TABLE public."CheckIn";
DROP TABLE public."BlokirKetersediaan";
DROP TYPE public."TipeTamu";
DROP TYPE public."StatusUnit";
DROP TYPE public."StatusTipeKamar";
DROP TYPE public."StatusProperti";
DROP TYPE public."StatusPemesanan";
DROP TYPE public."StatusPaketHarga";
DROP TYPE public."StatusBlokir";
DROP TYPE public."Peran";
--
-- Name: Peran; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Peran" AS ENUM (
    'TAMU',
    'TUAN_RUMAH',
    'ADMIN'
);


--
-- Name: StatusBlokir; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StatusBlokir" AS ENUM (
    'AKTIF',
    'NONAKTIF'
);


--
-- Name: StatusPaketHarga; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StatusPaketHarga" AS ENUM (
    'AKTIF',
    'NONAKTIF'
);


--
-- Name: StatusPemesanan; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StatusPemesanan" AS ENUM (
    'MENUNGGU_PEMBAYARAN',
    'PEMBAYARAN',
    'DIKONFIRMASI',
    'CHECK_IN',
    'SELESAI',
    'DIBATALKAN',
    'KADALUARSA',
    'DIKEMBALIKAN'
);


--
-- Name: StatusProperti; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StatusProperti" AS ENUM (
    'DRAFT',
    'TERTUNDA',
    'DITERBITKAN',
    'DITOLAK',
    'NONAKTIF',
    'DITANGGUHKAN'
);


--
-- Name: StatusTipeKamar; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StatusTipeKamar" AS ENUM (
    'AKTIF',
    'NONAKTIF'
);


--
-- Name: StatusUnit; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StatusUnit" AS ENUM (
    'TERSEDIA',
    'TERISI',
    'PERAWATAN',
    'NONAKTIF'
);


--
-- Name: TipeTamu; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipeTamu" AS ENUM (
    'DEWASA',
    'ANAK',
    'BAYI'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BlokirKetersediaan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BlokirKetersediaan" (
    id text NOT NULL,
    "unitKamarId" text NOT NULL,
    "tanggalMulai" timestamp(3) without time zone NOT NULL,
    "tanggalSelesai" timestamp(3) without time zone NOT NULL,
    alasan text,
    status public."StatusBlokir" DEFAULT 'AKTIF'::public."StatusBlokir" NOT NULL,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CheckIn; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CheckIn" (
    id text NOT NULL,
    "pemesananId" text NOT NULL,
    "unitKamarId" text NOT NULL,
    "discanOleh" text,
    "waktuCheckIn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: DetailPemesanan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DetailPemesanan" (
    id text NOT NULL,
    "pemesananId" text NOT NULL,
    "tipeKamarId" text NOT NULL,
    "unitKamarId" text,
    "paketHargaId" text NOT NULL,
    "jumlahKamar" integer DEFAULT 1 NOT NULL,
    "hargaSatuan" numeric(12,2) NOT NULL,
    subtotal numeric(12,2) NOT NULL
);


--
-- Name: Fasilitas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Fasilitas" (
    id text NOT NULL,
    nama text NOT NULL,
    ikon text
);


--
-- Name: FasilitasProperti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FasilitasProperti" (
    "propertiId" text NOT NULL,
    "fasilitasId" text NOT NULL
);


--
-- Name: FasilitasTipeKamar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FasilitasTipeKamar" (
    "tipeKamarId" text NOT NULL,
    "fasilitasId" text NOT NULL
);


--
-- Name: FotoProperti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FotoProperti" (
    id text NOT NULL,
    "propertiId" text NOT NULL,
    url text NOT NULL,
    "isUtama" boolean DEFAULT false NOT NULL,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: FotoTipeKamar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FotoTipeKamar" (
    id text NOT NULL,
    "tipeKamarId" text NOT NULL,
    url text NOT NULL,
    "isUtama" boolean DEFAULT false NOT NULL
);


--
-- Name: KasurTipeKamar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."KasurTipeKamar" (
    id text NOT NULL,
    "tipeKamarId" text NOT NULL,
    "tipeKasurId" text NOT NULL,
    jumlah integer DEFAULT 1 NOT NULL
);


--
-- Name: PaketHarga; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PaketHarga" (
    id text NOT NULL,
    "tipeKamarId" text NOT NULL,
    nama text NOT NULL,
    deskripsi text,
    harga numeric(12,2) NOT NULL,
    "termasukSarapan" boolean DEFAULT false NOT NULL,
    "dapatDikembalikan" boolean DEFAULT true NOT NULL,
    "kebijakanPembatalan" text,
    status public."StatusPaketHarga" DEFAULT 'AKTIF'::public."StatusPaketHarga" NOT NULL,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "diperbaruiPada" timestamp(3) without time zone NOT NULL
);


--
-- Name: Pembayaran; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Pembayaran" (
    id text NOT NULL,
    "pemesananId" text NOT NULL,
    "orderIdMidtrans" text,
    "transaksiIdMidtrans" text,
    "referensiPembayaran" text,
    jumlah numeric(12,2) NOT NULL,
    "metodePembayaran" text,
    "statusTransaksi" text,
    "statusPenipuan" text,
    "dibayarPada" timestamp(3) without time zone,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "diperbaruiPada" timestamp(3) without time zone NOT NULL
);


--
-- Name: Pemesanan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Pemesanan" (
    id text NOT NULL,
    "nomorPemesanan" text NOT NULL,
    "tamuId" text NOT NULL,
    "propertiId" text NOT NULL,
    "waktuCheckIn" timestamp(3) without time zone NOT NULL,
    "waktuCheckOut" timestamp(3) without time zone NOT NULL,
    dewasa integer NOT NULL,
    anak integer DEFAULT 0 NOT NULL,
    bayi integer DEFAULT 0 NOT NULL,
    "jumlahMalam" integer NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    "biayaLayanan" numeric(12,2) NOT NULL,
    pajak numeric(12,2) NOT NULL,
    diskon numeric(12,2) DEFAULT 0 NOT NULL,
    "totalHarga" numeric(12,2) NOT NULL,
    status public."StatusPemesanan" DEFAULT 'MENUNGGU_PEMBAYARAN'::public."StatusPemesanan" NOT NULL,
    "kadaluarsaPada" timestamp(3) without time zone,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "diperbaruiPada" timestamp(3) without time zone NOT NULL
);


--
-- Name: Pengguna; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Pengguna" (
    id text NOT NULL,
    email text NOT NULL,
    nama text NOT NULL,
    "kataSandi" text NOT NULL,
    peran public."Peran" DEFAULT 'TAMU'::public."Peran" NOT NULL,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "diperbaruiPada" timestamp(3) without time zone NOT NULL
);


--
-- Name: Properti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Properti" (
    id text NOT NULL,
    "tuanRumahId" text NOT NULL,
    "tipePropertiId" text NOT NULL,
    nama text NOT NULL,
    deskripsi text NOT NULL,
    alamat text NOT NULL,
    kota text NOT NULL,
    provinsi text NOT NULL,
    negara text NOT NULL,
    "garisLintang" double precision,
    "garisBujur" double precision,
    "waktuCheckIn" text,
    "waktuCheckOut" text,
    status public."StatusProperti" DEFAULT 'DRAFT'::public."StatusProperti" NOT NULL,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "diperbaruiPada" timestamp(3) without time zone NOT NULL,
    "nomorIdentitasHost" text,
    "urlBuktiKepemilikan" text,
    "urlDokumenIdentitas" text,
    "urlDokumenIzinUsaha" text
);


--
-- Name: TamuPemesanan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TamuPemesanan" (
    id text NOT NULL,
    "pemesananId" text NOT NULL,
    nama text NOT NULL,
    email text,
    telepon text,
    "tipeTamu" public."TipeTamu" DEFAULT 'DEWASA'::public."TipeTamu" NOT NULL
);


--
-- Name: TipeKamar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TipeKamar" (
    id text NOT NULL,
    "propertiId" text NOT NULL,
    nama text NOT NULL,
    deskripsi text,
    "hargaDasar" numeric(12,2) NOT NULL,
    "maksDewasa" integer NOT NULL,
    "maksAnak" integer NOT NULL,
    "maksTamu" integer NOT NULL,
    "ukuranKamar" integer,
    "totalUnit" integer DEFAULT 0 NOT NULL,
    status public."StatusTipeKamar" DEFAULT 'AKTIF'::public."StatusTipeKamar" NOT NULL,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "diperbaruiPada" timestamp(3) without time zone NOT NULL
);


--
-- Name: TipeKasur; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TipeKasur" (
    id text NOT NULL,
    nama text NOT NULL,
    deskripsi text
);


--
-- Name: TipeProperti; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TipeProperti" (
    id text NOT NULL,
    nama text NOT NULL,
    slug text NOT NULL,
    deskripsi text
);


--
-- Name: Ulasan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Ulasan" (
    id text NOT NULL,
    "propertiId" text NOT NULL,
    "penggunaId" text NOT NULL,
    "pemesananId" text NOT NULL,
    penilaian smallint NOT NULL,
    komentar text,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "diperbaruiPada" timestamp(3) without time zone NOT NULL
);


--
-- Name: UnitKamar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UnitKamar" (
    id text NOT NULL,
    "tipeKamarId" text NOT NULL,
    "nomorUnit" text NOT NULL,
    lantai text,
    status public."StatusUnit" DEFAULT 'TERSEDIA'::public."StatusUnit" NOT NULL,
    "dibuatPada" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "diperbaruiPada" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: BlokirKetersediaan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BlokirKetersediaan" (id, "unitKamarId", "tanggalMulai", "tanggalSelesai", alasan, status, "dibuatPada") FROM stdin;
\.


--
-- Data for Name: CheckIn; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CheckIn" (id, "pemesananId", "unitKamarId", "discanOleh", "waktuCheckIn") FROM stdin;
96f655e3-b928-4156-a1d0-020a89bfd85a	a3186df8-ab73-46fd-9dcb-3adb03e4ff66	064dd997-7534-47c7-9899-b1fc69728eef	\N	2026-08-27 03:55:43.416
\.


--
-- Data for Name: DetailPemesanan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."DetailPemesanan" (id, "pemesananId", "tipeKamarId", "unitKamarId", "paketHargaId", "jumlahKamar", "hargaSatuan", subtotal) FROM stdin;
a11455c5-6db7-4c38-8563-2accd1610439	a3186df8-ab73-46fd-9dcb-3adb03e4ff66	a0c10e83-2c1e-4412-b8fa-ef9ad5c24e45	064dd997-7534-47c7-9899-b1fc69728eef	5d6cd512-bcff-4e5b-a2e6-65dc85a00239	1	4500000.00	9000000.00
\.


--
-- Data for Name: Fasilitas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Fasilitas" (id, nama, ikon) FROM stdin;
848f4524-1ed7-4997-9a49-9702e2e35a58	Fast Wi-Fi	wifi
41d417a2-5d5b-432d-a5d1-8e912a71b679	Private Pool	pool
495b8c84-830b-4331-9cb1-e3679c22f415	Chef Kitchen	kitchen
9b8721a6-1f7b-4e1f-82cf-8ba9c0cb9c15	Free Parking	local_parking
\.


--
-- Data for Name: FasilitasProperti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FasilitasProperti" ("propertiId", "fasilitasId") FROM stdin;
481f1d8f-9318-45d9-83a1-1ab12d1d2b23	848f4524-1ed7-4997-9a49-9702e2e35a58
481f1d8f-9318-45d9-83a1-1ab12d1d2b23	41d417a2-5d5b-432d-a5d1-8e912a71b679
481f1d8f-9318-45d9-83a1-1ab12d1d2b23	495b8c84-830b-4331-9cb1-e3679c22f415
bde8b70a-f4a2-4622-b6dd-e01e899a4e97	848f4524-1ed7-4997-9a49-9702e2e35a58
bde8b70a-f4a2-4622-b6dd-e01e899a4e97	9b8721a6-1f7b-4e1f-82cf-8ba9c0cb9c15
104fe648-8ac8-4009-86ce-3ff80d086ef9	848f4524-1ed7-4997-9a49-9702e2e35a58
104fe648-8ac8-4009-86ce-3ff80d086ef9	41d417a2-5d5b-432d-a5d1-8e912a71b679
104fe648-8ac8-4009-86ce-3ff80d086ef9	9b8721a6-1f7b-4e1f-82cf-8ba9c0cb9c15
\.


--
-- Data for Name: FasilitasTipeKamar; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FasilitasTipeKamar" ("tipeKamarId", "fasilitasId") FROM stdin;
\.


--
-- Data for Name: FotoProperti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FotoProperti" (id, "propertiId", url, "isUtama", "dibuatPada") FROM stdin;
18996211-782b-40eb-a6a3-f1e1f73907c5	481f1d8f-9318-45d9-83a1-1ab12d1d2b23	https://lh3.googleusercontent.com/aida-public/AB6AXuCcG-ZmIM3d7cgBdUX0EZafJHxhzNL9sP54C1PsSWNhozODJQF0Pgq7B9ETMUWORSyk4JU9c5b5rh2-_kwInzltgX7MwHOPO9v1i_8i8Z8vz2g-KzyBSP3JtjfaC8mcgstO0d2g1q7RhhhaQdLbsAnMJrihmFaLZ_qTntt4tiPfJdKTHA9w8QS0cRPW0J9hnfT5l4TaozikDu4Mhmlv_rgub5Dxo0jZ-9norEAeRMbf3WLx5_kB5riq	t	2026-08-27 03:55:43.318
a4909fbc-86fa-4773-95ad-88468420c71b	481f1d8f-9318-45d9-83a1-1ab12d1d2b23	https://lh3.googleusercontent.com/aida-public/AB6AXuD55cSx6OHwrK415WRfmVhXj0WYF93Xf1GR6dWc7I5hQTLe5G9St9MpgwwXsuNZh4CaJYaH28O8y8crogRYPkJ3jxHUgvfsQeem39AFC0tuswJ9dHxEAagT6OP9PtbDLGlbjWVPCaK516bjc159XRu9AAuEF1SeoXF83gRPxOIbwrT7jEF0jg34zmFS0OeFST89Af8IkH97ohjQINX04_eAKBDH9FQBkMdZcTcUpcCTo5e6kRAJn1M1	f	2026-08-27 03:55:43.318
2600cc4e-1bdd-4551-9717-4bf64266cfe8	bde8b70a-f4a2-4622-b6dd-e01e899a4e97	https://lh3.googleusercontent.com/aida-public/AB6AXuAlF5FaTbVHJhzIZUrhKz2MlGW-EhNc2mpoLXUsXjvvgIKkuIxlE2vDYmU-NX18rz3tTFu-I3YIOv_F7wQYImdBrcC51D621ABxuhDNVi4DDhmNEL2L7Sy2BaaDfvjHFkuGlfmVxHmFYcW3lUCvgNjuiz-mmtp5WEoRUQq_7KyDRDW007_WtlE4bAbdqNYeu4BlBZp4v9CXphbwknbkVIBCgx4IkwIuRvWPSoNRaa5yRXextb_HfK8Q	t	2026-08-27 03:55:43.328
a5d66704-5039-4bce-a468-54ce0609909c	e4c815b9-2424-4ede-b65c-c1bf23ef6e38	https://lh3.googleusercontent.com/aida-public/AB6AXuCy3Ps_CdX2BN15cVk11qpxXxWNqfx1ovXW3n7BAsV2Kj5UIB8PJ6tp_o_TN3FaV6I-hlMVGaZW1Hlc-5Ery-PgRSoGPiusalxxlUSc_d43ScEV_-mq00P-PR5QaDvTbICy3C4E1fwsFmR41I08OjomlSZFxV3ImT55aX7CtbPMrLJ3pdaBf-Wx3aUN5YuNb77E7MhkNmGCrjlz7jkm_xdLWjE2JzNBJ77rpT9--uMO5P7ClsPOV7Wr	t	2026-08-27 03:55:43.339
81e19120-a901-4e92-a906-06e9da66505c	104fe648-8ac8-4009-86ce-3ff80d086ef9	https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80	t	2026-08-27 03:55:43.346
8560ec66-75d1-41a0-b34c-dd20035fdea1	104fe648-8ac8-4009-86ce-3ff80d086ef9	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80	f	2026-08-27 03:55:43.346
\.


--
-- Data for Name: FotoTipeKamar; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FotoTipeKamar" (id, "tipeKamarId", url, "isUtama") FROM stdin;
\.


--
-- Data for Name: KasurTipeKamar; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."KasurTipeKamar" (id, "tipeKamarId", "tipeKasurId", jumlah) FROM stdin;
3f83a506-2c3c-44e1-b9d3-3b05ed2d662f	a0c10e83-2c1e-4412-b8fa-ef9ad5c24e45	44ec81ae-3026-45cc-bd33-7a82304e7d8a	1
bf1a93ea-9cd9-43f5-8d32-3d7f8c32d636	c1611998-c5bb-42bc-ba20-21c57e6e5469	51e14835-d68f-48ba-bf0f-c16dd7682adc	1
63ba5b17-7586-47b3-8452-164feec6b0a9	231ddcce-fbcf-4c7d-8a21-47dbdbe9a259	51e14835-d68f-48ba-bf0f-c16dd7682adc	1
2db4d2db-e2b3-429b-8f57-847d54956f9a	b7e887c3-34f9-4b42-8c12-e8639e528bce	34212831-9f0e-4fd3-87bf-5db8976d03a5	2
36494cb6-ade1-4264-8c7f-ab84cef56f0f	46e0e365-dfe3-4e45-9836-16d51f665f61	51e14835-d68f-48ba-bf0f-c16dd7682adc	1
9fbcf52b-3aee-4abb-a918-e569e184979d	4747ccfd-5ff2-4e6f-a6ec-c9867e75df56	44ec81ae-3026-45cc-bd33-7a82304e7d8a	1
\.


--
-- Data for Name: PaketHarga; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PaketHarga" (id, "tipeKamarId", nama, deskripsi, harga, "termasukSarapan", "dapatDikembalikan", "kebijakanPembatalan", status, "dibuatPada", "diperbaruiPada") FROM stdin;
5d6cd512-bcff-4e5b-a2e6-65dc85a00239	a0c10e83-2c1e-4412-b8fa-ef9ad5c24e45	Standard Rate	\N	4500000.00	f	t	\N	AKTIF	2026-08-27 03:55:43.355	2026-08-27 03:55:43.355
ac337db5-c754-4fda-91a0-9601496a6eba	c1611998-c5bb-42bc-ba20-21c57e6e5469	Standard Rate	\N	7500000.00	f	t	\N	AKTIF	2026-08-27 03:55:43.372	2026-08-27 03:55:43.372
5373e269-7125-412a-abba-4897be4b6ad0	231ddcce-fbcf-4c7d-8a21-47dbdbe9a259	Standard Rate	\N	3500000.00	f	t	\N	AKTIF	2026-08-27 03:55:43.381	2026-08-27 03:55:43.381
4b4ffcd5-ed80-4254-af6f-6d40801c1fc8	b7e887c3-34f9-4b42-8c12-e8639e528bce	Room Only	\N	1200000.00	f	t	\N	AKTIF	2026-08-27 03:55:43.388	2026-08-27 03:55:43.388
0b2736e2-1a4d-4c58-81c3-976bfbf7255b	b7e887c3-34f9-4b42-8c12-e8639e528bce	With Breakfast	\N	1400000.00	t	t	\N	AKTIF	2026-08-27 03:55:43.388	2026-08-27 03:55:43.388
9d4f04d2-bf91-482c-bd01-9a7d189e5d42	46e0e365-dfe3-4e45-9836-16d51f665f61	Room Only	\N	2500000.00	f	t	\N	AKTIF	2026-08-27 03:55:43.398	2026-08-27 03:55:43.398
045acff6-ab32-4413-867b-b28d854ae497	4747ccfd-5ff2-4e6f-a6ec-c9867e75df56	All Inclusive	\N	8000000.00	t	t	\N	AKTIF	2026-08-27 03:55:43.407	2026-08-27 03:55:43.407
\.


--
-- Data for Name: Pembayaran; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Pembayaran" (id, "pemesananId", "orderIdMidtrans", "transaksiIdMidtrans", "referensiPembayaran", jumlah, "metodePembayaran", "statusTransaksi", "statusPenipuan", "dibayarPada", "dibuatPada", "diperbaruiPada") FROM stdin;
77e8f9ba-528e-4d6e-9015-86b070ae3802	a3186df8-ab73-46fd-9dcb-3adb03e4ff66	\N	\N	\N	10500000.00	CREDIT_CARD	settlement	\N	\N	2026-08-27 03:55:43.416	2026-08-27 03:55:43.416
\.


--
-- Data for Name: Pemesanan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Pemesanan" (id, "nomorPemesanan", "tamuId", "propertiId", "waktuCheckIn", "waktuCheckOut", dewasa, anak, bayi, "jumlahMalam", subtotal, "biayaLayanan", pajak, diskon, "totalHarga", status, "kadaluarsaPada", "dibuatPada", "diperbaruiPada") FROM stdin;
a3186df8-ab73-46fd-9dcb-3adb03e4ff66	ORD-12345	a21cc61f-3343-469e-a50e-2fadc0b79a26	481f1d8f-9318-45d9-83a1-1ab12d1d2b23	2026-08-28 03:55:43.414	2026-08-30 03:55:43.414	2	0	0	2	9000000.00	1000000.00	500000.00	0.00	10500000.00	DIKONFIRMASI	\N	2026-08-27 03:55:43.416	2026-08-27 03:55:43.416
\.


--
-- Data for Name: Pengguna; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Pengguna" (id, email, nama, "kataSandi", peran, "dibuatPada", "diperbaruiPada") FROM stdin;
3ba2a2a3-d052-4ca6-bf9f-ac52d886d60b	admin@staynest.com	Admin StayNest	$2b$10$4b/.MV8W/d4Hr75eg.z2W.3z1FFONUIxaWP5ys6dEkk4eL/D/bp6W	ADMIN	2026-08-27 03:55:43.258	2026-08-27 03:55:43.258
53c81a4f-cde6-4ecd-aa83-ae1dc21d60c3	sarah@host.com	Sarah Jenkins	$2b$10$4b/.MV8W/d4Hr75eg.z2W.3z1FFONUIxaWP5ys6dEkk4eL/D/bp6W	TUAN_RUMAH	2026-08-27 03:55:43.264	2026-08-27 03:55:43.264
c122079f-5b98-4c41-9fbc-e8c4b82e24ec	michael@host.com	Michael Chen	$2b$10$4b/.MV8W/d4Hr75eg.z2W.3z1FFONUIxaWP5ys6dEkk4eL/D/bp6W	TUAN_RUMAH	2026-08-27 03:55:43.268	2026-08-27 03:55:43.268
a21cc61f-3343-469e-a50e-2fadc0b79a26	john@guest.com	John Doe	$2b$10$4b/.MV8W/d4Hr75eg.z2W.3z1FFONUIxaWP5ys6dEkk4eL/D/bp6W	TAMU	2026-08-27 03:55:43.272	2026-08-27 03:55:43.272
\.


--
-- Data for Name: Properti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Properti" (id, "tuanRumahId", "tipePropertiId", nama, deskripsi, alamat, kota, provinsi, negara, "garisLintang", "garisBujur", "waktuCheckIn", "waktuCheckOut", status, "dibuatPada", "diperbaruiPada", "nomorIdentitasHost", "urlBuktiKepemilikan", "urlDokumenIdentitas", "urlDokumenIzinUsaha") FROM stdin;
bde8b70a-f4a2-4622-b6dd-e01e899a4e97	c122079f-5b98-4c41-9fbc-e8c4b82e24ec	1ac0e143-8bb0-43ed-90c5-0fb8163206ae	Royal Crest Manor	Our family vacation at Royal Crest Manor was unforgettable.	456 Beverly Dr	Beverly Hills	CA	United States	\N	\N	\N	\N	DITERBITKAN	2026-08-27 03:55:43.328	2026-08-27 03:55:43.328	\N	\N	\N	\N
481f1d8f-9318-45d9-83a1-1ab12d1d2b23	53c81a4f-cde6-4ecd-aa83-ae1dc21d60c3	8fdde852-8b26-440b-9e3c-8ba7f3874406	The Grandview Residences	Experience unparalleled luxury in this stunning architectural masterpiece nestled in the heart of Aspen.	123 Aspen Way	Aspen	Colorado	United States	39.1911	-106.8175	15:00	11:00	DITERBITKAN	2026-08-27 03:55:43.318	2026-08-27 03:55:43.318	\N	\N	\N	\N
e4c815b9-2424-4ede-b65c-c1bf23ef6e38	53c81a4f-cde6-4ecd-aa83-ae1dc21d60c3	d963eaa9-90b0-486f-bc57-5e49e6c2d9b6	Opulence Gardens	Experience the Swiss Alps in pure opulence.	789 Alpine Way	Zermatt	Valais	Switzerland	\N	\N	\N	\N	DITERBITKAN	2026-08-27 03:55:43.339	2026-08-27 03:55:43.339	\N	\N	\N	\N
104fe648-8ac8-4009-86ce-3ff80d086ef9	c122079f-5b98-4c41-9fbc-e8c4b82e24ec	66eca431-8bc2-46b5-beed-9ab49275ae44	Grand Plaza Hotel	Experience luxury and comfort in the heart of the city.	Jl. Jend. Sudirman No. 1	Jakarta	DKI Jakarta	Indonesia	\N	\N	14:00	12:00	DITERBITKAN	2026-08-27 03:55:43.346	2026-08-27 03:55:43.346	\N	\N	\N	\N
\.


--
-- Data for Name: TamuPemesanan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TamuPemesanan" (id, "pemesananId", nama, email, telepon, "tipeTamu") FROM stdin;
2c03b250-2f71-425b-93e8-77a866af8df4	a3186df8-ab73-46fd-9dcb-3adb03e4ff66	John Doe	\N	\N	DEWASA
\.


--
-- Data for Name: TipeKamar; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TipeKamar" (id, "propertiId", nama, deskripsi, "hargaDasar", "maksDewasa", "maksAnak", "maksTamu", "ukuranKamar", "totalUnit", status, "dibuatPada", "diperbaruiPada") FROM stdin;
a0c10e83-2c1e-4412-b8fa-ef9ad5c24e45	481f1d8f-9318-45d9-83a1-1ab12d1d2b23	Master Suite	\N	4500000.00	2	2	4	\N	1	AKTIF	2026-08-27 03:55:43.355	2026-08-27 03:55:43.355
c1611998-c5bb-42bc-ba20-21c57e6e5469	bde8b70a-f4a2-4622-b6dd-e01e899a4e97	Deluxe Room	\N	7500000.00	2	1	3	\N	2	AKTIF	2026-08-27 03:55:43.372	2026-08-27 03:55:43.372
231ddcce-fbcf-4c7d-8a21-47dbdbe9a259	e4c815b9-2424-4ede-b65c-c1bf23ef6e38	Cozy Cabin Room	\N	3500000.00	2	0	2	\N	1	AKTIF	2026-08-27 03:55:43.381	2026-08-27 03:55:43.381
b7e887c3-34f9-4b42-8c12-e8639e528bce	104fe648-8ac8-4009-86ce-3ff80d086ef9	Executive Twin Room	Kamar luas dengan 2 tempat tidur twin yang sangat nyaman, cocok untuk Anda yang bepergian dengan rekan kerja.	1200000.00	2	1	3	32	5	AKTIF	2026-08-27 03:55:43.388	2026-08-27 03:55:43.388
46e0e365-dfe3-4e45-9836-16d51f665f61	481f1d8f-9318-45d9-83a1-1ab12d1d2b23	Standard Room	Kamar nyaman yang ideal untuk pasangan atau wisatawan solo.	2500000.00	2	0	2	24	3	AKTIF	2026-08-27 03:55:43.398	2026-08-27 03:55:43.398
4747ccfd-5ff2-4e6f-a6ec-c9867e75df56	104fe648-8ac8-4009-86ce-3ff80d086ef9	Presidential Suite	Kamar super mewah dengan pemandangan kota terbaik, ruang tamu terpisah, dan layanan butler 24 jam.	8000000.00	2	2	4	80	1	AKTIF	2026-08-27 03:55:43.407	2026-08-27 03:55:43.407
\.


--
-- Data for Name: TipeKasur; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TipeKasur" (id, nama, deskripsi) FROM stdin;
44ec81ae-3026-45cc-bd33-7a82304e7d8a	King Size	Extra large comfortable bed
51e14835-d68f-48ba-bf0f-c16dd7682adc	Queen Size	Large comfortable bed
34212831-9f0e-4fd3-87bf-5db8976d03a5	Twin Bed	Single comfortable bed
\.


--
-- Data for Name: TipeProperti; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TipeProperti" (id, nama, slug, deskripsi) FROM stdin;
8fdde852-8b26-440b-9e3c-8ba7f3874406	Villa	villa	\N
1ac0e143-8bb0-43ed-90c5-0fb8163206ae	Resort	resort	\N
d963eaa9-90b0-486f-bc57-5e49e6c2d9b6	Cabin	cabin	\N
66eca431-8bc2-46b5-beed-9ab49275ae44	Hotel	hotel	\N
\.


--
-- Data for Name: Ulasan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Ulasan" (id, "propertiId", "penggunaId", "pemesananId", penilaian, komentar, "dibuatPada", "diperbaruiPada") FROM stdin;
28a79af0-7c61-436c-90af-e24d5c3b0d60	481f1d8f-9318-45d9-83a1-1ab12d1d2b23	a21cc61f-3343-469e-a50e-2fadc0b79a26	a3186df8-ab73-46fd-9dcb-3adb03e4ff66	5	The villa in Aspen exceeded all our expectations. The booking process was seamless.	2026-08-27 03:55:43.428	2026-08-27 03:55:43.428
\.


--
-- Data for Name: UnitKamar; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UnitKamar" (id, "tipeKamarId", "nomorUnit", lantai, status, "dibuatPada", "diperbaruiPada") FROM stdin;
064dd997-7534-47c7-9899-b1fc69728eef	a0c10e83-2c1e-4412-b8fa-ef9ad5c24e45	101A	\N	TERSEDIA	2026-08-27 03:55:43.355	2026-08-27 03:55:43.355
6c6e0410-a5df-4235-9e18-42dd6b13dd6b	c1611998-c5bb-42bc-ba20-21c57e6e5469	201B	\N	TERSEDIA	2026-08-27 03:55:43.372	2026-08-27 03:55:43.372
a0ebbfdb-1ea5-4975-a877-29653d8cb2c1	c1611998-c5bb-42bc-ba20-21c57e6e5469	202B	\N	TERSEDIA	2026-08-27 03:55:43.372	2026-08-27 03:55:43.372
312249f6-8643-4bea-9bce-531c5e251be8	231ddcce-fbcf-4c7d-8a21-47dbdbe9a259	301C	\N	TERSEDIA	2026-08-27 03:55:43.381	2026-08-27 03:55:43.381
48fffc7c-548f-4c59-bd67-1601a7346681	b7e887c3-34f9-4b42-8c12-e8639e528bce	101	\N	TERSEDIA	2026-08-27 03:55:43.388	2026-08-27 03:55:43.388
ccb4736d-a44c-45ce-8281-edf7a8a973a5	b7e887c3-34f9-4b42-8c12-e8639e528bce	102	\N	TERSEDIA	2026-08-27 03:55:43.388	2026-08-27 03:55:43.388
21d00a35-7343-454b-9e50-cb405f744609	b7e887c3-34f9-4b42-8c12-e8639e528bce	103	\N	TERSEDIA	2026-08-27 03:55:43.388	2026-08-27 03:55:43.388
dc93052e-6b68-44d7-8386-07f43dd9c277	b7e887c3-34f9-4b42-8c12-e8639e528bce	104	\N	TERSEDIA	2026-08-27 03:55:43.388	2026-08-27 03:55:43.388
921d4e75-f821-4ea4-9caa-b98dd14a45e6	b7e887c3-34f9-4b42-8c12-e8639e528bce	105	\N	TERSEDIA	2026-08-27 03:55:43.388	2026-08-27 03:55:43.388
e60c33c6-a1f9-4ad6-ad0f-143de3010c4c	46e0e365-dfe3-4e45-9836-16d51f665f61	102A	\N	TERSEDIA	2026-08-27 03:55:43.398	2026-08-27 03:55:43.398
860ce61d-c196-407a-a1bb-fdfe88593e45	46e0e365-dfe3-4e45-9836-16d51f665f61	103A	\N	TERSEDIA	2026-08-27 03:55:43.398	2026-08-27 03:55:43.398
efbb9276-03e5-4d8f-be4f-a8063fc89640	46e0e365-dfe3-4e45-9836-16d51f665f61	104A	\N	TERSEDIA	2026-08-27 03:55:43.398	2026-08-27 03:55:43.398
f9c9e816-2a7d-4411-a0fe-8a1d276d0582	4747ccfd-5ff2-4e6f-a6ec-c9867e75df56	Penthouse 1	\N	TERSEDIA	2026-08-27 03:55:43.407	2026-08-27 03:55:43.407
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
dbc5e0c0-b979-4d7e-8fdd-830534abf4cf	227e2ca2167e67f249f1433bdb5da007cedfcaa25b297c2fa310a303fc165b47	2026-08-08 14:17:50.50443+07	20260808071750_init_skema_indonesia	\N	\N	2026-08-08 14:17:50.403235+07	1
\.


--
-- Name: BlokirKetersediaan BlokirKetersediaan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BlokirKetersediaan"
    ADD CONSTRAINT "BlokirKetersediaan_pkey" PRIMARY KEY (id);


--
-- Name: CheckIn CheckIn_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CheckIn"
    ADD CONSTRAINT "CheckIn_pkey" PRIMARY KEY (id);


--
-- Name: DetailPemesanan DetailPemesanan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DetailPemesanan"
    ADD CONSTRAINT "DetailPemesanan_pkey" PRIMARY KEY (id);


--
-- Name: FasilitasProperti FasilitasProperti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FasilitasProperti"
    ADD CONSTRAINT "FasilitasProperti_pkey" PRIMARY KEY ("propertiId", "fasilitasId");


--
-- Name: FasilitasTipeKamar FasilitasTipeKamar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FasilitasTipeKamar"
    ADD CONSTRAINT "FasilitasTipeKamar_pkey" PRIMARY KEY ("tipeKamarId", "fasilitasId");


--
-- Name: Fasilitas Fasilitas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Fasilitas"
    ADD CONSTRAINT "Fasilitas_pkey" PRIMARY KEY (id);


--
-- Name: FotoProperti FotoProperti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FotoProperti"
    ADD CONSTRAINT "FotoProperti_pkey" PRIMARY KEY (id);


--
-- Name: FotoTipeKamar FotoTipeKamar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FotoTipeKamar"
    ADD CONSTRAINT "FotoTipeKamar_pkey" PRIMARY KEY (id);


--
-- Name: KasurTipeKamar KasurTipeKamar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KasurTipeKamar"
    ADD CONSTRAINT "KasurTipeKamar_pkey" PRIMARY KEY (id);


--
-- Name: PaketHarga PaketHarga_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaketHarga"
    ADD CONSTRAINT "PaketHarga_pkey" PRIMARY KEY (id);


--
-- Name: Pembayaran Pembayaran_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pembayaran"
    ADD CONSTRAINT "Pembayaran_pkey" PRIMARY KEY (id);


--
-- Name: Pemesanan Pemesanan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pemesanan"
    ADD CONSTRAINT "Pemesanan_pkey" PRIMARY KEY (id);


--
-- Name: Pengguna Pengguna_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pengguna"
    ADD CONSTRAINT "Pengguna_pkey" PRIMARY KEY (id);


--
-- Name: Properti Properti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Properti"
    ADD CONSTRAINT "Properti_pkey" PRIMARY KEY (id);


--
-- Name: TamuPemesanan TamuPemesanan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TamuPemesanan"
    ADD CONSTRAINT "TamuPemesanan_pkey" PRIMARY KEY (id);


--
-- Name: TipeKamar TipeKamar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TipeKamar"
    ADD CONSTRAINT "TipeKamar_pkey" PRIMARY KEY (id);


--
-- Name: TipeKasur TipeKasur_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TipeKasur"
    ADD CONSTRAINT "TipeKasur_pkey" PRIMARY KEY (id);


--
-- Name: TipeProperti TipeProperti_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TipeProperti"
    ADD CONSTRAINT "TipeProperti_pkey" PRIMARY KEY (id);


--
-- Name: Ulasan Ulasan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ulasan"
    ADD CONSTRAINT "Ulasan_pkey" PRIMARY KEY (id);


--
-- Name: UnitKamar UnitKamar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UnitKamar"
    ADD CONSTRAINT "UnitKamar_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Pembayaran_orderIdMidtrans_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Pembayaran_orderIdMidtrans_key" ON public."Pembayaran" USING btree ("orderIdMidtrans");


--
-- Name: Pembayaran_pemesananId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Pembayaran_pemesananId_key" ON public."Pembayaran" USING btree ("pemesananId");


--
-- Name: Pembayaran_transaksiIdMidtrans_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Pembayaran_transaksiIdMidtrans_key" ON public."Pembayaran" USING btree ("transaksiIdMidtrans");


--
-- Name: Pemesanan_nomorPemesanan_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Pemesanan_nomorPemesanan_key" ON public."Pemesanan" USING btree ("nomorPemesanan");


--
-- Name: Pengguna_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Pengguna_email_key" ON public."Pengguna" USING btree (email);


--
-- Name: TipeProperti_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TipeProperti_slug_key" ON public."TipeProperti" USING btree (slug);


--
-- Name: Ulasan_pemesananId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Ulasan_pemesananId_key" ON public."Ulasan" USING btree ("pemesananId");


--
-- Name: BlokirKetersediaan BlokirKetersediaan_unitKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BlokirKetersediaan"
    ADD CONSTRAINT "BlokirKetersediaan_unitKamarId_fkey" FOREIGN KEY ("unitKamarId") REFERENCES public."UnitKamar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CheckIn CheckIn_pemesananId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CheckIn"
    ADD CONSTRAINT "CheckIn_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES public."Pemesanan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CheckIn CheckIn_unitKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CheckIn"
    ADD CONSTRAINT "CheckIn_unitKamarId_fkey" FOREIGN KEY ("unitKamarId") REFERENCES public."UnitKamar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DetailPemesanan DetailPemesanan_paketHargaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DetailPemesanan"
    ADD CONSTRAINT "DetailPemesanan_paketHargaId_fkey" FOREIGN KEY ("paketHargaId") REFERENCES public."PaketHarga"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DetailPemesanan DetailPemesanan_pemesananId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DetailPemesanan"
    ADD CONSTRAINT "DetailPemesanan_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES public."Pemesanan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DetailPemesanan DetailPemesanan_tipeKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DetailPemesanan"
    ADD CONSTRAINT "DetailPemesanan_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES public."TipeKamar"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DetailPemesanan DetailPemesanan_unitKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DetailPemesanan"
    ADD CONSTRAINT "DetailPemesanan_unitKamarId_fkey" FOREIGN KEY ("unitKamarId") REFERENCES public."UnitKamar"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FasilitasProperti FasilitasProperti_fasilitasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FasilitasProperti"
    ADD CONSTRAINT "FasilitasProperti_fasilitasId_fkey" FOREIGN KEY ("fasilitasId") REFERENCES public."Fasilitas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FasilitasProperti FasilitasProperti_propertiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FasilitasProperti"
    ADD CONSTRAINT "FasilitasProperti_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES public."Properti"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FasilitasTipeKamar FasilitasTipeKamar_fasilitasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FasilitasTipeKamar"
    ADD CONSTRAINT "FasilitasTipeKamar_fasilitasId_fkey" FOREIGN KEY ("fasilitasId") REFERENCES public."Fasilitas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FasilitasTipeKamar FasilitasTipeKamar_tipeKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FasilitasTipeKamar"
    ADD CONSTRAINT "FasilitasTipeKamar_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES public."TipeKamar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FotoProperti FotoProperti_propertiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FotoProperti"
    ADD CONSTRAINT "FotoProperti_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES public."Properti"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FotoTipeKamar FotoTipeKamar_tipeKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FotoTipeKamar"
    ADD CONSTRAINT "FotoTipeKamar_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES public."TipeKamar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: KasurTipeKamar KasurTipeKamar_tipeKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KasurTipeKamar"
    ADD CONSTRAINT "KasurTipeKamar_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES public."TipeKamar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: KasurTipeKamar KasurTipeKamar_tipeKasurId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."KasurTipeKamar"
    ADD CONSTRAINT "KasurTipeKamar_tipeKasurId_fkey" FOREIGN KEY ("tipeKasurId") REFERENCES public."TipeKasur"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaketHarga PaketHarga_tipeKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PaketHarga"
    ADD CONSTRAINT "PaketHarga_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES public."TipeKamar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pembayaran Pembayaran_pemesananId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pembayaran"
    ADD CONSTRAINT "Pembayaran_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES public."Pemesanan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pemesanan Pemesanan_propertiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pemesanan"
    ADD CONSTRAINT "Pemesanan_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES public."Properti"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Pemesanan Pemesanan_tamuId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pemesanan"
    ADD CONSTRAINT "Pemesanan_tamuId_fkey" FOREIGN KEY ("tamuId") REFERENCES public."Pengguna"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Properti Properti_tipePropertiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Properti"
    ADD CONSTRAINT "Properti_tipePropertiId_fkey" FOREIGN KEY ("tipePropertiId") REFERENCES public."TipeProperti"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Properti Properti_tuanRumahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Properti"
    ADD CONSTRAINT "Properti_tuanRumahId_fkey" FOREIGN KEY ("tuanRumahId") REFERENCES public."Pengguna"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TamuPemesanan TamuPemesanan_pemesananId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TamuPemesanan"
    ADD CONSTRAINT "TamuPemesanan_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES public."Pemesanan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TipeKamar TipeKamar_propertiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TipeKamar"
    ADD CONSTRAINT "TipeKamar_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES public."Properti"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ulasan Ulasan_pemesananId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ulasan"
    ADD CONSTRAINT "Ulasan_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES public."Pemesanan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ulasan Ulasan_penggunaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ulasan"
    ADD CONSTRAINT "Ulasan_penggunaId_fkey" FOREIGN KEY ("penggunaId") REFERENCES public."Pengguna"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ulasan Ulasan_propertiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ulasan"
    ADD CONSTRAINT "Ulasan_propertiId_fkey" FOREIGN KEY ("propertiId") REFERENCES public."Properti"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UnitKamar UnitKamar_tipeKamarId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UnitKamar"
    ADD CONSTRAINT "UnitKamar_tipeKamarId_fkey" FOREIGN KEY ("tipeKamarId") REFERENCES public."TipeKamar"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict dcfOzD4U4IFkjhNTo8CsnzKaRXxhE7ZnHgRSkEimdrsTFoGExkGKqyeuGarKiI9

