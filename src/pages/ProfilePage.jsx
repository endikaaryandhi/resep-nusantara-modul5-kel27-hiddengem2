// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from 'react'; // <-- MODIFIKASI: Tambahkan useRef
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
  const fileInputRef = useRef(null); // <-- MODIFIKASI: Ref untuk input file

  // ... (Hook useFavorites dan state localFavorites tetap sama) ...
  const { 
    favorites: apiFavorites,
    loading: favoritesLoading, 
    error: favoritesError, 
    refetch: refetchFavorites 
  } = useFavorites();

  const [localFavorites, setLocalFavorites] = useState([]);

  useEffect(() => {
    if (apiFavorites) {
      setLocalFavorites(apiFavorites);
    }
  }, [apiFavorites]);

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
  
  // --- MODIFIKASI BARU: Fungsi untuk menangani klik avatar ---
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // --- MODIFIKASI BARU: Fungsi untuk menangani perubahan file avatar ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi sederhana (tipe dan ukuran)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak valid. Harap gunakan .jpg, .png, atau .webp.');
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('Ukuran file terlalu besar. Maksimal 2MB.');
      return;
    }

    // Ubah gambar menjadi Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      
      // Simpan menggunakan userService
      userService.updateAvatar(base64String);
      
      // Perbarui state profil secara instan
      setProfile(userService.getUserProfile());
      alert('Foto profil berhasil diperbarui!');
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Gagal membaca file gambar.');
    };
  };
  
  // ... (Fungsi handleFavoriteToggle tetap sama) ...
  const handleFavoriteToggle = (toggledRecipeId, newIsFavoritdState) => {
    if (newIsFavoritdState === false) {
      setLocalFavorites(prevFavorites => 
        prevFavorites.filter(recipe => recipe.id !== toggledRecipeId)
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Profile Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 mb-8">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* --- MODIFIKASI BESAR: Tampilan Foto Profil --- */}
            <div className="relative group">
              {/* Input file tersembunyi */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
              
              {/* Kontainer Avatar */}
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-lg overflow-hidden"
              >
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Foto Profil" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-12 h-12 md:w-16 md:h-16" />
                )}
              </div>
              
              {/* Tombol Ganti Foto (overlay saat hover) */}
              <button
                onClick={handleAvatarClick}
                className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                title="Ganti foto profil"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs font-medium mt-1">Ganti Foto</span>
              </button>
            </div>
            {/* --- AKHIR MODIFIKASI FOTO PROFIL --- */}

            
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
          
          {!favoritesLoading && !favoritesError && localFavorites.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Anda belum memiliki resep favorit.</p>
              <p className="text-slate-400 text-sm mt-1">Tekan ikon hati pada resep untuk menambahkannya.</p>
            </div>
          )}
          
          {!favoritesError && localFavorites.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {localFavorites.map(recipe => (
                <RecipeCardSmall
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => onRecipeClick(recipe.id, recipe.category)}
                  onToggleComplete={handleFavoriteToggle}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}