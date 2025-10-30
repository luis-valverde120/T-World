"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ShoppingCart from '@/components/icons/shopping_cart';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast'; // <<< ¡AÑADE ESTA LÍNEA!

// --- Definición de tipos ---
interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}
interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: string; // La API ya lo convierte a string
  imagenes: string[];
  tallas: string[];
  colores: string[];
  categoria: Categoria | null;
}

export default function ProductoPage() {
  // --- Estados ---
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Opciones seleccionadas por el usuario
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Obtenemos el slug de la URL
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { addToCart } = useCart();

  // --- Lógica de Fetch ---
  useEffect(() => {
    if (!slug) return;

    const fetchProducto = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/productos/${slug}`);
        if (!response.ok) {
          setError(true);
          return;
        }
        const data: Producto = await response.json();
        setProducto(data);
        // Selecciona la primera talla y color por defecto
        if (data.tallas.length > 0) setSelectedTalla(data.tallas[0]);
        if (data.colores.length > 0) setSelectedColor(data.colores[0]);

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [slug]);

  const handleAddToCart = () => {
    // Validaciones
    if (!producto) return;
    if (!selectedTalla) {
      toast.error("Por favor, selecciona una talla.");
      return;
    }
    if (!selectedColor) {
      toast.error("Por favor, selecciona un color.");
      return;
    }

    if (!slug) {
      toast.error("Error: No se pudo identificar el producto.");
      return;
    }

    // Creamos el item para el carrito
    const itemToAdd = {
      id: producto.id,
      nombre: producto.nombre,
      slug: slug,
      imageUrl: producto.imagenes[0] || "/placeholder.png",
      precio: parseFloat(producto.precio), // Convertimos a número
      talla: selectedTalla,
      color: selectedColor,
    };
    
    // Llamamos a la función del "cerebro"
    // ¡Esto automáticamente mostrará la notificación!
    addToCart(itemToAdd);
  };

  // --- Renderizado con Guardias ---
  if (loading) {
    return <div className="text-center py-20"><p>Cargando producto...</p></div>;
  }

  if (error || !producto) {
    return <div className="text-center py-20"><h1 className="text-2xl font-bold">Producto no encontrado</h1></div>;
  }

  // --- Renderizado de la Página ---
  return (
    <div className="container mx-auto max-w-4xl py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Columna de Imagen */}
        <div className="w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src={producto.imagenes[0] || "/placeholder.png"}
            alt={producto.nombre}
            fill
            className="object-cover"
          />
        </div>

        {/* Columna de Información y Acciones */}
        <div className="flex flex-col justify-center">
          {/* Categoría */}
          {producto.categoria && (
            <Link 
              href={`/categoria/${producto.categoria.slug}`}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              {producto.categoria.nombre}
            </Link>
          )}

          {/* Título */}
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            {producto.nombre}
          </h1>

          {/* Precio */}
          <p className="text-3xl font-bold text-gray-800 mt-4">
            ${producto.precio}
          </p>

          {/* Descripción */}
          <p className="text-gray-600 mt-4">
            {producto.descripcion || "Sin descripción disponible."}
          </p>

          {/* Selector de Tallas */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Talla:</h3>
            <div className="flex gap-2 mt-2">
              {producto.tallas.map(talla => (
                <button
                  key={talla}
                  onClick={() => setSelectedTalla(talla)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium
                    ${selectedTalla === talla 
                      ? 'bg-gray-900 text-white border-gray-900' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Colores */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Color:</h3>
            <div className="flex gap-2 mt-2">
              {producto.colores.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2
                    ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-900' : 'border-gray-300'}
                  `}
                  style={{ backgroundColor: color.toLowerCase() }} // Asume colores CSS (Negro, Blanco, etc.)
                />
              ))}
            </div>
          </div>

          {/* Botón de Añadir al Carrito */}
          <button
          onClick={handleAddToCart} // <<< 4. CONECTAMOS LA FUNCIÓN
          className="mt-10 w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          Añadir al Carrito
        </button>
        </div>
      </div>
    </div>
  );
}