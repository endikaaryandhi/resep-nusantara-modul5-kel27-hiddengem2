// src/components/common/RecipeCardSmall.jsx
import { Clock, ChefHat } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

// --- MODIFIKASI: Terima 'onToggleComplete' sebagai prop ---
export default function RecipeCardSmall({ recipe, onClick, onToggleComplete }) {
  if (!recipe) return null;

  const categoryColors = {
    makanan: {
      text: 'text-blue-700',
      bg: 'bg-blue-100/90',
    },
    minuman: {
      text: 'text-green-700',
      bg: 'bg-green-100/90',
    }
  };
  
  const colors = categoryColors[recipe.category] || categoryColors.makanan;

  return (
    <div 
      onClick={onClick}
      className="group relative flex gap-4 bg-white/50 backdrop-blur-sm border border-white/40 p-4 rounded-2xl shadow-lg shadow-blue-500/5 hover:shadow-blue-500/15 transition-all duration-300 cursor-pointer hover:bg-white/80"
    >
      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="flex-1 relative">
        <span className={`text-xs font-semibold ${colors.text} ${colors.bg} px-2 py-1 rounded-full capitalize`}>
          {recipe.category}
        </span>
        
        <h3 className="font-bold text-slate-800 my-2 text-base md:text-lg group-hover:text-blue-600 line-clamp-2">
          {recipe.name}
        </h3>
        
        <div className="flex items-center gap-4 text-xs md:text-sm text-slate-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span className="font-medium">{recipe.prep_time || '?'} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <ChefHat className="w-3 h-3 md:w-4 md:h-4" />
            <span className="font-medium capitalize">{recipe.difficulty || 'mudah'}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        {/* --- MODIFIKASI: Teruskan 'onToggleComplete' ke FavoriteButton --- */}
        <FavoriteButton 
          recipeId={recipe.id} 
          size="sm" 
          onToggleComplete={onToggleComplete} 
        />
      </div>
    </div>
  );
}