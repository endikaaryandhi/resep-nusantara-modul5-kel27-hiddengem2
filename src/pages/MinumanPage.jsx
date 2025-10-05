// src/pages/MinumanPage.jsx
import { useState, useEffect } from 'react';
import { ResepMinuman } from '../data/minuman';
import RecipeGrid from '../components/minuman/RecipeGrid';

export default function MinumanPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  
  const allMinuman = Object.values(ResepMinuman.resep);

  useEffect(() => {
   
    const filter = () => {
      if (searchQuery.trim() === '') {
        setFilteredRecipes(allMinuman);
      } else {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = allMinuman.filter(recipe => 
          recipe.name.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredRecipes(filtered);
      }
    };


    filter();
  });

  return (
  
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
       
        <RecipeGrid recipes={filteredRecipes} />
      </main>
    </div>
  );
}