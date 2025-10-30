"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from '@/components/icons/CheckCircle';
import { useCart } from '@/context/CartContext';

interface ProductoItem {
  nombre: string;
  imagenes: string[];
}
interface PedidoItem {
  id: string;
  cantidad: number;
  precioUnidad: string;
  talla: string;
  color: string;
  producto: ProductoItem;
}
interface PedidoCompleto {
  id: string;
  total: string;
  createdAt: string; // Prisma devuelve fechas como strings
  items: PedidoItem[];
}

export default function Page() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [pedido, setPedido] = useState<PedidoCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Limpia el carrito
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // 2. Busca los detalles del pedido
  useEffect(() => {
    if (orderId) {
      fetch(`/api/pedidos/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setPedido(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error al cargar el pedido:", err);
          setErrorMsg(err.message); // Guardamos el mensaje de error
        });
    } else {
      setLoading(false);
      setErrorMsg("No se proporcionó un ID de pedido.");
    }
  }, [orderId]); 

  if (loading) {
    return <div className="text-center py-20"><p>Cargando tu historial...</p></div>;
  }

  if (errorMsg || !pedido) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">Error al cargar el pedido</h1>
        <p className="text-gray-600">{errorMsg || "No se pudo encontrar el pedido."}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-6">
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
        <h1 className="text-3xl font-bold text-green-600 mb-4">¡Pago Exitoso!</h1>
        <p className="text-lg text-gray-700 mb-2">Gracias por tu compra.</p>
        <p className="text-gray-500">Pedido ID: {pedido.id}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mt-10">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Resumen de tu Compra</h2>
        
        {/* Lista de Items */}
        <div className="space-y-4 mb-6">
          {pedido.items.map(item => (
            <div key={item.id} className="flex gap-4">
              <Image 
                src={item.producto.imagenes[0] || '/placeholder.png'} 
                alt={item.producto.nombre}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.producto.nombre}</h3>
                <p className="text-sm text-gray-600">Talla: {item.talla}, Color: {item.color}</p>
                <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
              </div>
              <p className="font-semibold">${(parseFloat(item.precioUnidad) * item.cantidad).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total Pagado:</span>
            <span>${pedido.total}</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="bg-gray-900 text-white py-2 px-6 rounded-md hover:bg-gray-700">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}