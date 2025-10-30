import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 px-6 md:px-12 bg-gray-900 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">T-World</h3>
          <p>Viste tu pasión.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Navegación</h3>
          <ul className="space-y-2">
            <li><Link href="/categorias" className="hover:text-white">Categorías</Link></li>
            <li><Link href="/cuenta" className="hover:text-white">Mi Cuenta</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link href="/terminos" className="hover:text-white">Términos y Condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-white">Política de Privacidad</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 pt-8 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} T-World. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}