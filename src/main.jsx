// src/main.jsx
import { StrictMode, useState, lazy, Suspense, useEffect } from 'react'; // Import useEffect
import { createRoot } from 'react-dom/client';
import SplashScreen from './pages/SplashScreen';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import './index.css';
import PWABadge from './PWABadge';
import { apiCache } from './utils/cache';

// --- Lazy Load Pages ---
const HomePage = lazy(() => import('./pages/HomePage'));
const MakananPage = lazy(() => import('./pages/MakananPage'));
const MinumanPage = lazy(() => import('./pages/MinumanPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CreateRecipePage = lazy(() => import('./pages/CreateRecipePage'));
const EditRecipePage = lazy(() => import('./pages/EditRecipePage'));
const RecipeDetail = lazy(() => import('./components/recipe/RecipeDetail'));
// -----------------------

// --- Helper untuk mendapatkan state awal dari URL ---
const getInitialState = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeIdFromUrl = urlParams.get('recipe');
  const categoryFromUrl = urlParams.get('category') || 'makanan'; // Default

  if (recipeIdFromUrl) {
    // Jika ada parameter recipe, langsung ke halaman detail
    return {
      showSplash: false, // Lewati splash
      currentPage: categoryFromUrl, // Atur kategori
      mode: 'detail', // Langsung ke mode detail
      selectedRecipeId: recipeIdFromUrl,
      selectedCategory: categoryFromUrl,
      editingRecipeId: null,
    };
  }

  // Jika tidak, state normal
  return {
    showSplash: true,
    currentPage: 'home',
    mode: 'list',
    selectedRecipeId: null,
    selectedCategory: 'makanan',
    editingRecipeId: null,
  };
};
// ------------------------------------------

function AppRoot() {
  const initialState = getInitialState(); // Dapatkan state awal sekali
  
  const [showSplash, setShowSplash] = useState(initialState.showSplash);
  const [currentPage, setCurrentPage] = useState(initialState.currentPage);
  const [mode, setMode] = useState(initialState.mode);
  const [selectedRecipeId, setSelectedRecipeId] = useState(initialState.selectedRecipeId);
  const [selectedCategory, setSelectedCategory] = useState(initialState.selectedCategory);
  const [editingRecipeId, setEditingRecipeId] = useState(initialState.editingRecipeId);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // --- MODIFIKASI: Hapus parameter URL saat navigasi biasa ---
  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    // Hapus parameter query dari URL
    window.history.pushState(null, '', window.location.pathname);
  };

  const handleCreateRecipe = () => {
    setMode('create');
  };

  // --- MODIFIKASI: Tambahkan parameter URL saat klik resep ---
  const handleRecipeClick = (recipeId, category) => {
    const safeCategory = category || currentPage;
    setSelectedRecipeId(recipeId);
    setSelectedCategory(safeCategory);
    setMode('detail');
    
    // --- BARU: Perbarui URL bar ---
    const newUrl = `${window.location.pathname}?recipe=${recipeId}&category=${safeCategory}`;
    window.history.pushState({ recipeId, category: safeCategory }, `Resep ${recipeId}`, newUrl);
    // -------------------------
  };

  const handleEditRecipe = (recipeId) => {
    console.log('🔧 Edit button clicked! Recipe ID:', recipeId);
    setEditingRecipeId(recipeId);
    setMode('edit');
    console.log('✅ Mode changed to: edit');
  };

  // --- MODIFIKASI: Hapus parameter URL saat kembali ---
  const handleBack = () => {
    if (selectedRecipeId) {
      apiCache.delete(`recipe_${selectedRecipeId}`);
    }
    apiCache.invalidatePrefix('recipes_');
    
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    
    // --- BARU: Hapus parameter query dari URL ---
    window.history.pushState(null, '', window.location.pathname);
    // -------------------------
  };

  const handleCreateSuccess = (newRecipe) => {
    alert('Resep berhasil dibuat!');
    apiCache.invalidatePrefix('recipes_');
    setMode('list');
    
    // Hapus parameter query dari URL
    window.history.pushState(null, '', window.location.pathname);

    if (newRecipe && newRecipe.category) {
      setCurrentPage(newRecipe.category);
    }
  };

  const handleEditSuccess = (updatedRecipe) => {
    alert('Resep berhasil diperbarui!');
    if (editingRecipeId) {
      apiCache.delete(`recipe_${editingRecipeId}`);
    }
    apiCache.invalidatePrefix('recipes_');
    
    setMode('list');
    setEditingRecipeId(null);
    // Hapus parameter query dari URL
    window.history.pushState(null, '', window.location.pathname);
  };
  
  // Menangani tombol back/forward browser
  useEffect(() => {
    const handlePopState = (event) => {
      // Jika state kosong (dihapus oleh handleBack/handleNav), kembali ke list
      if (!event.state || !event.state.recipeId) {
        setMode('list');
        setSelectedRecipeId(null);
        setCurrentPage('home'); // Kembali ke home sebagai default
      } else {
        // Jika ada state, pulihkan halaman detail
        setMode('detail');
        setSelectedRecipeId(event.state.recipeId);
        setSelectedCategory(event.state.category);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderCurrentPage = () => {
    // ... (sisa renderCurrentPage SAMA SEPERTI SEBELUMNYA) ...
    // (Show Create Recipe Page)
    if (mode === 'create') {
      return (
        <CreateRecipePage
          onBack={handleBack}
          onSuccess={handleCreateSuccess}
        />
      );
    }

    // (Show Edit Recipe Page)
    if (mode === 'edit') {
      return (
        <EditRecipePage
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    }

    // (Show Recipe Detail)
    if (mode === 'detail') {
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          category={selectedCategory}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );
    }

    // (Show List Pages)
    switch (currentPage) {
      case 'home':
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage onRecipeClick={handleRecipeClick} />;
      case 'minuman':
        return <MinumanPage onRecipeClick={handleRecipeClick} />;
      case 'profile':
        return <ProfilePage onRecipeClick={handleRecipeClick} />;
      default:
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {mode === 'list' && (
        <>
          <DesktopNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}
      
      <main className="min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          {renderCurrentPage()}
        </Suspense>
      </main>

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)