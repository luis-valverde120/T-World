"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Mail from '@/components/icons/Mail';
import LogIn from '@/components/icons/LogIn';

// Este es el ícono de Google (puedes usar un SVG o una imagen)
const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.2H24v7.3h11.2c-.4 2.8-2.3 5.3-5.5 7.1v4.8h6.2c3.6-3.3 5.7-8 5.7-13.6c0-1.4-.1-2.6-.2-3.6z" />
    <path fill="#FF3D00" d="m24 44c6.3 0 11.6-2.1 15.5-5.7l-6.2-4.8c-2.1 1.4-4.8 2.3-7.8 2.3c-6 0-11-4-12.8-9.5H4.9v4.9C8.9 38.6 15.9 44 24 44z" />
    <path fill="#4CAF50" d="M11.2 28.5c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8V16H4.9C3.1 19.3 2 23.5 2 28.5s1.1 9.2 3.1 12.5l6.2-4.9z" />
    <path fill="#1976D2" d="M24 9.5c3.2 0 5.8 1.1 7.9 3.1l5.5-5.5C35.6 3.6 30.1 1 24 1C15.9 1 8.9 6.4 4.9 14.1l6.3 4.9c1.8-5.4 6.8-9.5 12.8-9.5z" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false, // No redirigimos, manejamos la respuesta
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push('/'); // Redirige al inicio si el login es exitoso
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Bienvenido de Vuelta</h2>
        
        {/* Botón de Google */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <GoogleIcon />
          Continuar con Google
        </button>

        {/* Divisor "O" */}
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">O</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Formulario de Email/Contraseña */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Continuar con Email
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-medium text-gray-900 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}