"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserPlus from '@/components/icons/UserPlus';

// --- COPIA EL ÍCONO DE GOOGLE ---
// (Puedes mover esto a su propio archivo, ej: components/icons/GoogleIcon.tsx)
const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.2H24v7.3h11.2c-.4 2.8-2.3 5.3-5.5 7.1v4.8h6.2c3.6-3.3 5.7-8 5.7-13.6c0-1.4-.1-2.6-.2-3.6z" />
    <path fill="#FF3D00" d="m24 44c6.3 0 11.6-2.1 15.5-5.7l-6.2-4.8c-2.1 1.4-4.8 2.3-7.8 2.3c-6 0-11-4-12.8-9.5H4.9v4.9C8.9 38.6 15.9 44 24 44z" />
    <path fill="#4CAF50" d="M11.2 28.5c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8V16H4.9C3.1 19.3 2 23.5 2 28.5s1.1 9.2 3.1 12.5l6.2-4.9z" />
    <path fill="#1976D2" d="M24 9.5c3.2 0 5.8 1.1 7.9 3.1l5.5-5.5C35.6 3.6 30.1 1 24 1C15.9 1 8.9 6.4 4.9 14.1l6.3 4.9c1.8-5.4 6.8-9.5 12.8-9.5z" />
  </svg>
);
// --- FIN DEL ÍCONO ---

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    // ... (tu lógica de 'handleSubmit' se queda igual)
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Algo salió mal');
        return;
      }
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.ok) {
        router.push('/');
      } else {
        setError('Error al iniciar sesión después del registro.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Crear una Cuenta</h2>
        
        {/* --- AÑADE ESTO --- */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <GoogleIcon />
          Registrarse con Google
        </button>

        {/* --- Y ESTO --- */}
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">O</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Formulario de Registro (ya lo tenías) */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (tus campos de 'nombre', 'email', 'password') ... */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input id="nombre" name="nombre" type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ..."/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ..."/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ..."/>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm ... text-white bg-gray-900 hover:bg-gray-700 ..."
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Crear Cuenta con Email
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium text-gray-900 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}