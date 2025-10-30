import Image from 'next/image';
import Link from 'next/link';
import ShoppingCart from './icons/shopping_cart';

interface ProductCardProps {
  slug: string; // <<< AÑADIMOS EL SLUG
  imageUrl: string;
  title: string;
  category: string;
  price: string;
}

export default function ProductCard({ slug, imageUrl, title, category, price }: ProductCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm group">
      {/* 1. ENLACE A LA PÁGINA DE DETALLES */}
      <Link href={`/productos/${slug}`}>
        <div className="relative w-full h-80 overflow-hidden rounded-t-lg">
          <Image 
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{category}</p>
        {/* 1. ENLACE A LA PÁGINA DE DETALLES (TAMBIÉN EN EL TÍTULO) */}
        <Link href={`/productos/${slug}`}>
          <h3 className="text-lg font-semibold mb-2 truncate hover:text-gray-700">
            {title}
          </h3>
        </Link>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">{price}</p>
          
          {/* 2. BOTÓN DE AÑADIR AL CARRITO */}
          <button 
            className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Añadir al carrito"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}