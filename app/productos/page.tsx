"use client";

import { useState, useEffect, FormEvent } from 'react';
import ProductCard from '@/components/ProductCard';

// Tipos de datos que esperamos de nuestras APIs
interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}
interface Producto {
  id: string;
  nombre: string;
  slug: string;
  imagenes: string[];
  precio: string; // La API ya lo convierte a string
  categoria: string;
}

export default function ProductosPage() {
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Se guarda el 'slug'

  // Estados para los datos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Cargar la lista de categorías (para el <select>) ---
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categorias');
        const data: Categoria[] = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, []); // Se ejecuta solo una vez

  // --- 2. Cargar los productos (al inicio y cuando cambian los filtros) ---
  const fetchProductos = async () => {
    setLoading(true);
    // Construye la URL con los parámetros de búsqueda
    const query = new URLSearchParams({
      search: searchTerm,
      category: selectedCategory,
    });

    try {
      const response = await fetch(`/api/productos?${query.toString()}`);
      const data: Producto[] = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial de productos
  useEffect(() => {
    fetchProductos();
  }, []); // Carga todos los productos al inicio

  // Función para manejar el envío del formulario de filtros
  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchProductos(); // Vuelve a cargar los productos con los nuevos filtros
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
        Todos los Productos
      </h1>

      {/* --- Barra de Filtros --- */}
      <form onSubmit={handleFilterSubmit} className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg shadow">
        {/* Filtro de Búsqueda */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Buscar por nombre
          </label>
          <input
            type="search"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej: Camiseta Anime"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Filtro de Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Filtrar por categoría
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.slug}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Botón de Aplicar */}
        <div className="md:mt-6">
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </form>

      {/* --- Cuadrícula de Resultados --- */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron productos con esos filtros.</p>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {productos.map((producto) => (
            <ProductCard
            key={producto.id}
            title={producto.nombre}
            category={producto.categoria}
            imageUrl={producto.imagenes[0] || "/placeholder.png"}
            price={`$${producto.precio}`}
            slug={producto.slug} // <<< AÑADE ESTA LÍNEA
          />
          ))}
        </div>
      )}
    </div>
  );
}