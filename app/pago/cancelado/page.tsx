import Link from 'next/link';
import { XCircle } from "@/components/icons/XCircle"; 

export default function PagoCanceladoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <XCircle className="w-24 h-24 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Pago Cancelado</h1>
      <p className="text-lg text-gray-700 mb-8">
        Tu pago fue cancelado. Tu carrito sigue guardado.
      </p>
      <Link href="/carrito" className="bg-gray-900 text-white py-2 px-6 rounded-md hover:bg-gray-700">
        Volver al Carrito
      </Link>
    </div>
  );
}