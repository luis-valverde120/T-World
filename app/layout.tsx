import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider'; // <<< 1. IMPORTA
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'T-World - Viste tu Pasión',
  description: 'Camisetas personalizadas de anime, música, gym y más.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider> {/* <<< 3. ENVUELVE CON EL CARRITO */}
            <Toaster position="bottom-center" /> {/* <<< 4. AÑADE EL TOASTER */}
            <div className="bg-white text-gray-900 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider> {/* <<< 3. FIN DEL CARRITO */}
        </AuthProvider>
      </body>
    </html>
  );
}
