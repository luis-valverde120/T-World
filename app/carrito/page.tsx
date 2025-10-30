"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "@/components/icons/Trash";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from 'react-hot-toast';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaginaCarrito() {
  const { cartItems, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false); // <<< 3. Estado de carga

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const items = cartItems.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        quantity: item.quantity,
        talla: item.talla, 
        color: item.color,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la sesión de pago");
      }

      // --- ¡CAMBIO CLAVE! ---
      // 3. Redirige a la URL que nos dio la API
      if (data.url) {
        window.location.href = data.url; // Redirección simple
      } else {
        throw new Error("No se recibió URL de pago");
      }

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // Calculamos el subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.precio * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto max-w-4xl py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>

      {/* Revisa si el carrito está vacío */}
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">Tu carrito está vacío.</p>
          <Link
            href="/productos"
            className="mt-4 inline-block bg-gray-900 text-white py-2 px-6 rounded-md hover:bg-gray-700"
          >
            Seguir comprando
          </Link>
        </div>
      ) : (
        // Si hay items, muestra la tabla y el resumen
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Lista de Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.talla}-${item.color}`}
                className="flex gap-4 p-4 border rounded-lg shadow-sm"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.nombre}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <Link
                    href={`/producto/${item.slug}`}
                    className="font-semibold text-lg hover:underline"
                  >
                    {item.nombre}
                  </Link>
                  <p className="text-sm text-gray-600">Talla: {item.talla}</p>
                  <p className="text-sm text-gray-600">Color: {item.color}</p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="font-semibold text-lg">
                    ${(item.precio * item.quantity).toFixed(2)}
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id, item.talla, item.color)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Eliminar item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Columna 2: Resumen de Pago */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-28">
              <h2 className="text-2xl font-semibold mb-4">
                Resumen del Pedido
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Envío</span>
                <span className="font-semibold">Gratis</span>
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="mt-6 w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-700 disabled:bg-gray-500"
              >
                {loading ? "Procesando..." : "Proceder al Pago"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
