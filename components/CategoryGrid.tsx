// components/CategoryGrid.tsx
"use client"; // <<< Ahora es un componente de cliente

import { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';

// Definimos el tipo de dato que esperamos
interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  imageUrl: string;
}

export default function CategoryGrid() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esta función 'fetch' llama a tu API
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categorias');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las categorías');
        }
        const data: Categoria[] = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);// El array vacío asegura que solo se ejecute una vez

  return (
    <section className="py-16 md:py-24 px-6 md:px-12">
      <h2 className="text-3xl font-bold text-center mb-12">Nuestras Categorías</h2>
      
      {loading && (
        <p className="text-center text-gray-500">Cargando...</p>
      )}

      {!loading && categorias.length === 0 && (
        <p className="text-center text-gray-500">Aún no hay categorías para mostrar.</p>
      )}

      {!loading && categorias.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categorias.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              title={cat.nombre}
              imageUrl={cat.imageUrl}
              href={`/categorias/${cat.slug}`} // Usamos el 'slug' para la URL
            />
          ))}
        </div>
      )} 
    </section>
  );
}