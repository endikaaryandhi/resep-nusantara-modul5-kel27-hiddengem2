// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react'; // <-- Pastikan useEffect dan useState di-import
import { User, Edit3, Save, Camera, Heart, Mail, Info } from 'lucide-react';
import userService from '../services/userService';
import { useFavorites } from '../hooks/useFavorites';
import RecipeCardSmall from '../components/common/RecipeCardSmall';

// Komponen placeholder untuk resep yang sedang dimuat
const RecipeCardSmallSkeleton = () => (
  <div className="flex gap-4 bg-white/50 p-4 rounded-2xl border border-white/40 animate-pulse">
    <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl bg-slate-200"></div>
    <div className="flex-1 space-y-3 py-1">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="flex gap-4">
        <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        <div className="h-5 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export default function ProfilePage({ onRecipeClick }) {
  const [profile, setProfile] = useState(userService.getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);

  // Hook untuk fetching data asli dari API
  const { 
    favorites: apiFavorites, // Ganti nama 'favorites' -> 'apiFavorites'
    loading: favoritesLoading, 
    error: favoritesError, 
    refetch: refetchFavorites 
  } = useFavorites();

  // --- MODIFIKASI: State lokal untuk daftar favorit ---
  // Kita merender dari state ini agar bisa memanipulasinya secara instan
  const [localFavorites, setLocalFavorites] = useState([]);

  // --- MODIFIKASI: Sinkronkan data API ke state lokal saat pertama kali dimuat ---
  useEffect(() => {
    if (apiFavorites) {
      setLocalFavorites(apiFavorites);
    }
  }, [apiFavorites]); // Ini hanya berjalan saat 'apiFavorites' dari hook berubah

  useEffect(() => {
    refetchFavorites();
  }, []);

  const handleSaveProfile = () => {
    userService.updateUsername(username);
    userService.updateBio(bio);
    setProfile(userService.getUserProfile());
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  // --- MODIFIKASI: Fungsi yang akan dipanggil oleh FavoriteButton ---
  const handleFavoriteToggle = (toggledRecipeId, newIsFavoritedState) => {
    // 'newIsFavoritedState' akan bernilai 'false' jika kita baru saja meng-unfavorite
    if (newIsFavoritedState === false) {
      // Hapus item dari state LOKAL secara instan
      setLocalFavorites(prevFavorites => 
        prevFavorites.filter(recipe => recipe.id !== toggledRecipeId)
      );
    }
    // Kita tidak perlu memanggil refetchFavorites() di sini,
    // karena FavoriteButton (via useIsFavorited) sudah melakukannya 
    // di background untuk kita. Ini hanya untuk update UI instan.
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Profile Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 mb-8">
          {/* ... (Kode untuk info profil, edit, save... tetap sama) ... */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                <User className="w-12 h-12 md:w-16 md:h-16" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-2xl md:text-3xl font-bold text-slate-800 w-full border-b-2 border-blue-500 bg-transparent focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                  {profile.username}
                </h1>
              )}
              
              <p className="text-slate-500 text-sm mt-1">{profile.userId}</p>
              
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tulis bio singkat..."
                  rows={2}
                  className="text-slate-600 mt-3 w-full border border-slate-300 rounded-lg p-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-slate-600 mt-3">
                  {profile.bio || "Pengguna belum menulis bio."}
                </p>
              )}
            </div>
            
            <button
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                isEditing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {isEditing ? 'Simpan' : 'Edit Profil'}
            </button>
          </div>
        </div>

        {/* Favorite Recipes Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500" />
            Resep Favorit
          </h2>
          
          {/* MODIFIKASI: Tampilkan skeleton hanya jika loading DAN state lokal masih kosong */}
          {favoritesLoading && localFavorites.length === 0 && (
            <div className="space-y-4">
              <RecipeCardSmallSkeleton />
              <RecipeCardSmallSkeleton />
            </div>
          )}
          
          {!favoritesLoading && favoritesError && (
            <div className="text-center py-8">
              <p className="text-red-500">{favoritesError}</p>
            </div>
          )}
          
          {/* MODIFIKASI: Cek 'localFavorites.length' */}
          {!favoritesLoading && !favoritesError && localFavorites.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Anda belum memiliki resep favorit.</p>
              <p className="text-slate-400 text-sm mt-1">Tekan ikon hati pada resep untuk menambahkannya.</p>
            </div>
          )}
          
          {/* MODIFIKASI: Render dari 'localFavorites' */}
          {!favoritesError && localFavorites.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {localFavorites.map(recipe => (
                <RecipeCardSmall
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => onRecipeClick(recipe.id, recipe.category)}
                  onToggleComplete={handleFavoriteToggle} // <-- MODIFIKASI: Teruskan fungsi callback
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}