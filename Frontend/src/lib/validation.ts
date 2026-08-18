import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
});

export const propertySchema = z.object({
  title: z.string().min(5, "Judul terlalu pendek").max(100, "Judul terlalu panjang"),
  description: z.string().min(20, "Deskripsi terlalu pendek"),
  pricePerNight: z.number().positive("Harga harus berupa angka positif"),
  guests: z.number().positive().int("Jumlah tamu harus berupa angka bulat"),
  location: z.string().min(2, "Lokasi wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
