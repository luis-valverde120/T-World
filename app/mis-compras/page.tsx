"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Pedido {
  id: string;
  total: string;
  estado: string;
  createdAt: string;
}

export default function MisComprasPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pedidos') // Llama a la API que acabamos de crear
      .then(res => res.json())
      .then(data => {
        setPedidos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20"><p>Cargando tu historial...</p></div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Mi Historial de Compras</h1>

      {pedidos.length === 0 ? (
        <p className="text-center text-gray-600">Aún no has realizado ninguna compra.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Pedido ID: {pedido.id}</p>
                <p className="text-lg font-bold">${pedido.total}</p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(pedido.createdAt).toLocaleDateString()}
                </p>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  pedido.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {pedido.estado}
                </span>
              </div>
              <div>
                {/* Este enlace aún no funciona, pero es la idea */}
                <Link href={`/pago/exito?order_id=${pedido.id}`} className="text-gray-900 hover:underline">
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}