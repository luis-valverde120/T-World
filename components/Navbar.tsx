"use client";

import Link from 'next/link';
import UserPlus from './icons/UserPlus';
import LogIn from './icons/LogIn';
import ShoppingCart from './icons/shopping_cart';
import User from './icons/user';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { data: session, status } = useSession();
  const { itemCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center w-full px-6 md:px-12 py-4 bg-white shadow-md">
      <Link href="/" className="text-2xl font-bold text-gray-900">
        T-World
      </Link>

      {/* Links de Navegación Central */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/" className="font-medium text-gray-600 hover:text-gray-900">Inicio</Link>
        <Link href="/categorias" className="font-medium text-gray-600 hover:text-gray-900">Categorías</Link>
        <Link 
          href="/productos" 
          className="font-medium text-gray-600 hover:text-gray-900"
        >
          Productos
        </Link>
      </div>

      {/* Contenido de la Derecha (Login / Usuario) */}
      <div className="flex gap-4 items-center">
        {status === "loading" && (
          // Placeholder mientras carga la sesión
          <div className="w-24 h-6 bg-gray-200 animate-pulse rounded-md"></div>
        )}

        {status === "unauthenticated" && (
          <>
            <Link
              href="/login" // <-- Cambiado a Link
              className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-900"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
            <Link
              href="/register" // <-- Cambiado a Link
              className="hidden sm:flex items-center gap-2 font-medium text-white bg-gray-900 px-3 py-1 rounded-md hover:bg-gray-700"
            >
              <UserPlus className="w-5 h-5" />
              Register
            </Link>
          </>
        )}

        {status === "authenticated" && (
          // Usuario SÍ logueado: Muestra Carrito e Ícono de Usuario
          <>
            <Link href="/carrito" aria-label="Carrito de Compras">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-2 right-14 sm:right-60 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            <span className="hidden sm:block font-medium text-gray-700">
              Hola, {session.user.name}
            </span>

            {/* Este botón ahora desloguea al usuario */}
            <button onClick={() => signOut()} aria-label="Mi Cuenta">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}