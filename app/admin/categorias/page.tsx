"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from 'next/image';

// Tipo de dato para la categoría
interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  imageUrl: string;
}

export default function Page() {
  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  // Estados para la lista
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Lógica para OBTENER (GET) las categorías ---
  const fetchCategorias = async () => {
    setLoadingList(true);
    try {
      // Usamos la API que ya creamos
      const response = await fetch('/api/categorias');
      if (!response.ok) throw new Error("Error al cargar categorías");
      const data: Categoria[] = await response.json();
      setCategorias(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  // Cargar las categorías cuando el componente se monta
  useEffect(() => {
    fetchCategorias();
  }, []);

  // --- 2. Lógica para CREAR (POST) una categoría ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingForm(true);

    try {
      // Usamos la API que ya creamos
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, slug, imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 'data.message' viene del error de nuestra API (ej. "Slug ya existe")
        throw new Error(data.message || 'Error al crear la categoría');
      }

      // Si tiene éxito: limpiar formulario y recargar la lista
      setNombre("");
      setSlug("");
      setImageUrl("");
      fetchCategorias(); // Recarga la lista para mostrar la nueva
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Gestionar Categorías</h1>

      {/* Formulario para AÑADIR */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Añadir Nueva Categoría</h2>
        
        {/* Muestra de Errores */}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          {/* Campo Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (URL)</label>
            <input
              type="text"
              id="slug"
              value={slug}
              placeholder="ej: musica-rock"
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
        </div>
        
        {/* Campo Image URL */}
        <div className="mt-6">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            placeholder="https://..."
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loadingForm}
          className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
        >
          {loadingForm ? "Creando..." : "Crear Categoría"}
        </button>
      </form>

      {/* Lista de Categorías EXISTENTES */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Categorías Existentes</h2>
        {loadingList ? (
           <p>Cargando lista...</p>
        ) : (
          <ul className="space-y-4">
            {categorias.map(cat => (
              <li key={cat.id} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-4">
                  <Image src={cat.imageUrl} alt={cat.nombre} width={50} height={50} className="w-12 h-12 object-cover rounded"/>
                  <div>
                    <p className="font-semibold">{cat.nombre}</p>
                    <p className="text-sm text-gray-500">/categoria/{cat.slug}</p>
                  </div>
                </div>
                {/* Aquí irían los botones de Editar/Borrar en el futuro */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}