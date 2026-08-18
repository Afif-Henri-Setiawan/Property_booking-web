import DOMPurify from 'dompurify';

/**
 * Mensanitasi input string HTML menggunakan DOMPurify untuk mencegah XSS.
 * Peringatan: DOMPurify standar bekerja secara native di browser. 
 * Jika dipanggil di lingkungan server (Node.js), fungsi ini akan mengembalikan string aslinya.
 * Untuk sanitasi di server, disarankan menggunakan `isomorphic-dompurify` atau JSDOM.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (typeof window === 'undefined') {
    // Lingkungan Server
    return dirtyHtml; 
  }
  
  // Lingkungan Klien (Browser)
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}
