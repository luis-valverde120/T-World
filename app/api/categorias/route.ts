// app/api/categorias/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request: Request) { // 'request' es necesario para leer la URL
  try {
    // 1. Leemos los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');

    const options: Prisma.CategoriaFindManyArgs = {
      orderBy: {
        nombre: 'asc',
      },
      take: limitParam ? parseInt(limitParam) : undefined,
    };

    const categorias = await prisma.categoria.findMany(options);

    return NextResponse.json(categorias);

  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  
  // <<< 1. AÑADIR ESTA VERIFICACIÓN DE SEGURIDAD
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }
  // <<< FIN DE LA VERIFICACIÓN

  try {
    const { nombre, slug, imageUrl } = await request.json();

    if (!nombre || !slug || !imageUrl) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
    }

    // 2. Revisar si el slug ya existe
    const existingSlug = await prisma.categoria.findUnique({ where: { slug } });
    if (existingSlug) {
       return NextResponse.json({ message: "El slug ya existe" }, { status: 409 });
    }

    // 3. Crear la nueva categoría
    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre, slug, imageUrl },
    });

    return NextResponse.json(nuevaCategoria, { status: 201 });

  } catch (error: any) {
    console.error("Error al crear categoría:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}