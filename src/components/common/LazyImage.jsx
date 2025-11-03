// src/components/common/LazyImage.jsx
import { useState, useEffect, useRef } from 'react';

// Komponen placeholder sederhana
const ImagePlaceholder = () => (
  <div className="w-full h-full bg-slate-200 animate-pulse" />
);

/**
 * Komponen LazyImage yang disempurnakan
 * @param {Object} props
 * @param {string} props.src - URL sumber gambar
 * @param {string} props.alt - Teks alternatif gambar
 * @param {string} props.containerClassName - ClassName untuk div pembungkus (mengatur layout/dimensi, cth: "h-32 w-32")
 * @param {string} props.imgClassName - ClassName untuk tag <img> (mengatur object-fit, transisi, hover, cth: "object-cover group-hover:scale-110")
 */
export default function LazyImage({ src, alt, containerClassName, imgClassName }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Buat observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika elemen masuk ke viewport
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target); // Berhenti mengamati setelah terlihat
        }
      },
      {
        rootMargin: '100px 0px', // Mulai load 100px sebelum elemen masuk viewport
        threshold: 0.01,
      }
    );

    const currentRef = containerRef.current;
    
    // Mulai amati elemen kontainer
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Bersihkan observer saat komponen unmount
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali

  return (
    // 1. Kontainer ini yang diamati oleh IntersectionObserver
    //    Dia bertanggung jawab untuk layout (ukuran, overflow, dll)
    <div ref={containerRef} className={`relative ${containerClassName}`}>
      
      {/* 2. Tampilkan placeholder JIKA gambar belum selesai dimuat */}
      {!isLoaded && (
        <div className="absolute inset-0">
          <ImagePlaceholder />
        </div>
      )}
      
      {/* 3. Hanya render tag <img> JIKA kontainer sudah masuk viewport */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          // 4. imgClassName bertanggung jawab untuk styling gambar (object-fit, animasi)
          className={`transition-opacity duration-500 ${imgClassName} ${
            isLoaded ? 'opacity-100' : 'opacity-0' // Transisi fade-in saat gambar dimuat
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy" // Fallback native lazy loading
        />
      )}
    </div>
  );
}