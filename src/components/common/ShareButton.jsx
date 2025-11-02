// src/components/common/ShareButton.jsx
import { useState } from 'react';
import { Share2, Link, Check } from 'lucide-react';

export default function ShareButton({ title, text, recipeId, category }) {
  const [copied, setCopied] = useState(false);

  // Buat URL yang benar
  const shareUrl = `${window.location.origin}${window.location.pathname}?recipe=${recipeId}&category=${category}`;

  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: shareUrl, // Gunakan URL yang sudah dibuat
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset message after 2s
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        alert('Gagal menyalin link');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
        copied
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
      }`}
      title="Bagikan resep"
      style={{ minWidth: '100px' }} // Beri lebar minimum agar tidak "melompat"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span className="hidden md:inline">Disalin!</span>
        </>
      ) : (
        <>
          {navigator.share ? <Share2 className="w-4 h-4" /> : <Link className="w-4 h-4" />}
          <span className="hidden md:inline">Bagikan</span>
        </>
      )}
    </button>
  );
}