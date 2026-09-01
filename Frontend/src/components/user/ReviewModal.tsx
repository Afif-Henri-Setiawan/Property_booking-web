"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, bookingId, onSuccess }: ReviewModalProps) {
  const { getToken } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");
    if (rating === 0) {
      setErrorMsg("Silakan berikan rating (bintang) terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
      const res = await fetch(`${apiUrl}/ulasan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pemesananId: bookingId,
          penilaian: rating,
          komentar: comment
        })
      });

      const result = await res.json();
      if (result.status === 'success') {
        onSuccess();
        onClose();
        // Reset form
        setRating(0);
        setComment("");
      } else {
        setErrorMsg(result.message || "Gagal mengirim ulasan.");
      }
    } catch (err: any) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Beri Ulasan</DialogTitle>
          <DialogDescription>
            Bagaimana pengalaman menginap Anda? Ulasan Anda akan membantu tamu lain!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-hidden transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-100 text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-500">
              {rating === 1 && "Sangat Buruk"}
              {rating === 2 && "Buruk"}
              {rating === 3 && "Cukup"}
              {rating === 4 && "Bagus"}
              {rating === 5 && "Sangat Bagus!"}
              {rating === 0 && "Pilih penilaian"}
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label htmlFor="comment" className="text-sm font-medium text-gray-700">
              Komentar (Opsional)
            </label>
            <textarea
              id="comment"
              rows={4}
              placeholder="Ceritakan apa yang Anda sukai atau tidak sukai..."
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden resize-none transition-all"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg">
              {errorMsg}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl">
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Ulasan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
