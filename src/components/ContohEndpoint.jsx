// Contoh cara pemanggilan di dalam komponen React
// (misalnya di file baru: src/components/ContohEndpoint.jsx)

import { useRecipes } from '../hooks/useRecipes';

export default function ResepMakananSedangTerlama() {
  
  // Tentukan parameter filter sesuai permintaan Anda
  const filterParams = {
    category: 'makanan',
    difficulty: 'sedang',
    sort_by: 'created_at', // 'Sort by'
    order: 'asc',          // 'oldest' (ascending)
    limit: 10,
    page: 1,
  };

  // Gunakan hook useRecipes dengan parameter tersebut
  const { recipes, loading, error } = useRecipes(filterParams);

  if (loading) {
    return <div>Memuat resep makanan (sedang, terlama)...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Resep Makanan (Sedang, Terlama)</h2>
      {recipes.length > 0 ? (
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id}>
              {recipe.name} (Difficulty: {recipe.difficulty})
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada resep yang ditemukan.</p>
      )}
    </div>
  );
}