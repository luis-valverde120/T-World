"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/ProductCard";
import ArrowLeft from "./icons/ArrowLeft";
import ArrowRight from "./icons/ArrowRight";

// Definimos el tipo de producto que esperamos de la API
interface ProductoDestacado {
  id: string;
  nombre: string;
  slug: string;
  imagenes: string[];
  precio: string; // Ya viene como string desde la API
  categoria: string; // El nombre de la categoría
}

export default function FeaturedProducts() {
  const [productos, setProductos] = useState<ProductoDestacado[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Configuración del Carrusel (Embla) ---
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true, // Para que sea infinito
    align: "start",
    containScroll: "trimSnaps",
  });

  // Funciones para los botones de Prev/Next
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // --- 2. Carga de Datos (Fetch) ---
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/api/productos/destacados");
        if (!response.ok) throw new Error("Error al cargar productos");
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // --- 3. Renderizado ---
  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Encabezado y Botones de Navegación */}
        <div className="flex justify-between items-center mb-12 px-2">
          <h2 className="text-3xl font-bold text-gray-900">
            Destacados del Mes
          </h2>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              aria-label="Anterior"
            >
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              aria-label="Siguiente"
            >
              <ArrowRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Mensajes de Carga o Error */}
        {loading && (
          <p className="text-center text-gray-500">Cargando productos...</p>
        )}
        {!loading && productos.length === 0 && (
          <p className="text-center text-gray-500">
            No hay productos destacados por ahora.
          </p>
        )}

        {/* El Carrusel (Embla Viewport) */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex -ml-4">
            {/* Usamos 'flex-grow-0 flex-shrink-0' para que cada slide
              tenga el tamaño correcto.
              'basis-full' = 1 slide por vista en móvil
              'md:basis-1/2' = 2 slides en tablet
              'lg:basis-1/3' = 3 slides en desktop
            */}
            {productos.map((producto) => (
              <div key={producto.id} className="embla__slide ...">
                <ProductCard
                  title={producto.nombre}
                  category={producto.categoria}
                  imageUrl={producto.imagenes[0] || "/placeholder.png"}
                  price={`$${producto.precio}`}
                  slug={producto.slug} // <<< AÑADE ESTA LÍNEA
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
