"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Review {
  id: string;
  penilaian: number;
  komentar: string | null;
  dibuatPada: string;
  pengguna: {
    nama: string;
  };
  pemesanan: {
    detail: Array<{
      tipeKamar: {
        nama: string;
      }
    }>
  };
}

export default function ReviewList({ propertyId }: { propertyId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
        const res = await fetch(`${apiUrl}/ulasan/properti/${propertyId}`);
        if (!res.ok) throw new Error("Gagal memuat ulasan");
        const data = await res.json();
        if (data.status === 'success') {
          setReviews(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 text-red-600 rounded-xl border border-red-100">
        <p>Gagal memuat ulasan: {error}</p>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.penilaian, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div id="ulasan" className="pt-8 border-t border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-50 text-yellow-600">
          <Star className="fill-yellow-500 w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A4F]">Ulasan Tamu</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-bold text-gray-900">{averageRating}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 font-medium">{reviews.length} ulasan</span>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-900 font-medium">Belum ada ulasan</h3>
          <p className="text-gray-500 text-sm mt-1">Jadilah yang pertama memberikan ulasan untuk properti ini!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {review.pengguna.nama.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.pengguna.nama}</h4>
                    <p className="text-xs text-gray-500">
                      {format(new Date(review.dibuatPada), "dd MMMM yyyy", { locale: id })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700">{review.penilaian}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-400 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                Menginap di <span className="font-semibold text-gray-600">
                  {review.pemesanan.detail?.[0]?.tipeKamar?.nama || 'Kamar'}
                </span>
              </div>
              
              <p className="text-gray-700 leading-relaxed text-sm">
                {review.komentar || <span className="italic text-gray-400">Tidak ada komentar tambahan.</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
