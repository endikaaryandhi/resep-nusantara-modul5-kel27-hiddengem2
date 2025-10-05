// src/pages/HomePage.jsx
import { ResepMakanan } from '../data/makanan';
import { ResepMinuman } from '../data/minuman';
import HeroSection from '../components/home/HeroSection';
import FeaturedMakananSection from '../components/home/FeaturedMakananSection';
import FeaturedMinumanSection from '../components/home/FeaturedMinumanSection';

export default function HomePage() {
  const featuredMakanan = Object.values(ResepMakanan.resep).slice(0, 3);
  const featuredMinuman = Object.values(ResepMinuman.resep).slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <HeroSection />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16">
        <FeaturedMakananSection featuredMakanan={featuredMakanan} />
        <FeaturedMinumanSection featuredMinuman={featuredMinuman} />
      </main>
    </div>
  );
}