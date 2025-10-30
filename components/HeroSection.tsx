import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center h-screen bg-black">
      {/* Imagen de fondo con overlay oscuro */}
      <Image
        src="https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160"
        alt="Modelo vistiendo camiseta personalizada"
        fill
        className="object-cover opacity-50" // object-cover reemplaza a la prop objectFit
      />
      {/* Contenido del Hero */}
      <div className="relative z-10 text-center text-white p-4">
        <h1 className="text-4xl md:text-7xl font-extrabold mb-4">
          VISTE TU PASIÓN
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl">
          Camisetas personalizadas de tus animes, series y bandas favoritas. Calidad que se siente, diseños que se ven.
        </p>
        <Link 
          href="/categorias" 
          className="px-8 py-3 bg-white text-gray-900 font-bold rounded-md text-lg hover:bg-gray-200 transition-colors"
        >
          Explorar Colección
        </Link>
      </div>
    </section>
  );
}