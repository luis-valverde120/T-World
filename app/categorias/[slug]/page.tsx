"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

// Definimos los tipos de datos que esperamos de nuestra API
interface Producto {
  id: string;
  nombre: string;
  imagenes: string[];
  slug: string;
  precio: string; // Es un string porque la API lo convirtió
}

interface CategoriaConProductos {
  id: string;
  nombre: string;
  slug: string;
  productos: Producto[];
}

export default function Page() {
  const [categoria, setCategoria] = useState<CategoriaConProductos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Para manejar 404 o 500

  const params = useParams();

  useEffect(() => {
    if (!params.slug) return; // No hacer nada si el slug no está listo

    const fetchCategoria = async () => {
      setLoading(true);
      setError(false);
      try {
        // 1. Llamamos a nuestra nueva API dinámica
        const response = await fetch(`/api/categorias/${params.slug}`);

        if (!response.ok) {
          // Si la API devuelve 404 (no encontrada) o 500
          setError(true);
          return;
        }

        const data: CategoriaConProductos = await response.json();
        setCategoria(data);

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500">Cargando productos...</p>
      </div>
    );
  }

  if (error || !categoria) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-800">Categoría no encontrada</h1>
        <p className="text-gray-600">No pudimos encontrar la categoría "{params.slug}".</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        {categoria!.nombre}
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Explora todos nuestros productos de {categoria!.nombre.toLowerCase()}.
      </p>

      {categoria!.productos.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">
          Aún no hay productos en esta categoría. ¡Vuelve pronto!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {categoria!.productos.map((producto) => (
            <ProductCard
              key={producto.id}
              title={producto.nombre}
              category={categoria!.nombre} // Le pasamos el nombre de la categoría
              imageUrl={producto.imagenes[0] || "/images/placeholder.png"} // (Asegúrate de tener un placeholder)
              slug={producto.slug}
              price={`$${producto.precio.toString()}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}