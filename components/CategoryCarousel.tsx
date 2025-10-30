"use client";

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import CategoryCard from '@/components/CategoryCard';
import ArrowLeft from './icons/ArrowLeft';
import ArrowRight from './icons/ArrowRight';

// Definimos el tipo de categoría
interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  imageUrl: string;
}

export default function CategoryCarousel() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Configuración del Carrusel (Embla) ---
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, // Bucle infinito
    align: 'start',
    // Mostraremos 5 categorías, pero puedes cambiar el 'limit=5'
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);


  // --- 2. Carga de Datos (Fetch) ---
  useEffect(() => {
    // Llamamos a la API que ya creaste, pidiendo 5 categorías
    const fetchCategorias = async () => {
      try {
        const response = await fetch('/api/categorias?limit=5');
        if (!response.ok) throw new Error("Error al cargar categorías");
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []); // Se ejecuta solo una vez


  // --- 3. Renderizado ---
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Encabezado y Botones de Navegación */}
        <div className="flex justify-between items-center mb-12 px-2">
          <h2 className="text-3xl font-bold text-gray-900">Nuestras Categorías</h2>
          <div className="flex gap-2">
            <button 
              onClick={scrollPrev} 
              className="p-2 rounded-full bg-gray-100 shadow-md hover:bg-gray-200" 
              aria-label="Anterior"
            >
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button 
              onClick={scrollNext} 
              className="p-2 rounded-full bg-gray-100 shadow-md hover:bg-gray-200" 
              aria-label="Siguiente"
            >
              <ArrowRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Mensajes de Carga o Error */}
        {loading && <p className="text-center text-gray-500">Cargando categorías...</p>}
        {!loading && categorias.length === 0 && (
          <p className="text-center text-gray-500">No hay categorías por ahora.</p>
        )}

        {/* El Carrusel (Embla Viewport) */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex -ml-4">
            {/* Ajustamos 'basis' para controlar cuántos se ven:
              - Móvil: basis-full (1)
              - Tablet: md:basis-1/2 (2)
              - Desktop: lg:basis-1/3 (3)
              - Desktop Grande: xl:basis-1/4 (4)
            */}
            {categorias.map((cat) => (
              <div 
                key={cat.id} 
                className="embla__slide flex-grow-0 flex-shrink-0 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4"
              >
                {/* Reutilizamos tu 'CategoryCard' existente */}
                <CategoryCard
                  title={cat.nombre}
                  imageUrl={cat.imageUrl}
                  href={`/categorias/${cat.slug}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}