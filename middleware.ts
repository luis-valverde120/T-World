import { NextResponse, type NextRequest } from 'next/server';
import { handleAdminAuth } from './lib/middlewares/adminAuth'; // Importamos la lógica

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Si la ruta es del admin, usamos el "guardia" de admin
  if (pathname.startsWith('/admin')) {
    return handleAdminAuth(req);
  }

  // Aquí podrías añadir más 'if' para otras rutas
  // if (pathname.startsWith('/perfil')) {
  //   return handleUserAuth(req);
  // }

  return NextResponse.next(); // Deja pasar el resto de peticiones
}

// El 'matcher' se queda aquí para definir QUÉ rutas
// activan este archivo middleware
export const config = {
  matcher: [
    '/admin/:path*',
    // '/perfil/:path*',
  ],
};