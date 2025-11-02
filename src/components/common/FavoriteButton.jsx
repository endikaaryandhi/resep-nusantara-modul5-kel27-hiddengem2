// src/components/common/FavoriteButton.jsx
import { Heart, Loader2 } from 'lucide-react';
import { useIsFavorited } from '../../hooks/useFavorites'; 

// --- MODIFIKASI: Terima 'onToggleComplete' sebagai prop ---
export default function FavoriteButton({ recipeId, size = 'md', onToggleComplete }) {
  
  // Hook ini tetap digunakan untuk menangani logika API
  const { isFavorited, loading, toggleFavorite } = useIsFavorited(recipeId);

  // Size variants
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleToggle = async (e) => {
    e.stopPropagation(); 
    if (loading) return;
    
    // Panggil fungsi toggle dari hook. Ini akan memanggil API
    // dan juga memanggil refetch() internal hook tersebut.
    const result = await toggleFavorite();

    // --- MODIFIKASI: Panggil callback 'onToggleComplete' jika ada ---
    if (result && onToggleComplete) {
      // 'result.is_favorited' adalah status BARU dari server
      // Kirim status baru ini kembali ke parent (ProfilePage)
      onToggleComplete(recipeId, result.is_favorited);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center gap-1.5
        transition-all duration-200 
        ${isFavorited 
          ? 'bg-red-100 text-red-600' 
          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-red-500'
        }
        backdrop-blur-sm shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
        group
      `}
      title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin text-slate-500`} />
      ) : (
        <Heart 
          className={`
            ${iconSizes[size]} 
            transition-all duration-200
            ${isFavorited ? 'fill-current text-red-600' : 'text-slate-500 group-hover:text-red-500'}
          `} 
        />
      )}
    </button>
  );
}