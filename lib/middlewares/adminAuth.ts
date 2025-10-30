import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function handleAdminAuth(req: NextRequest) {
  // Obtenemos el token de una forma más robusta
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAdmin = token?.role === "ADMIN";

  // Si la URL es de admin y NO es admin, redirigimos
  if (!isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = '/'; // Redirige a la página de inicio
    return NextResponse.redirect(url);
  }

  // Si es admin, déjalo pasar
  return NextResponse.next();
}