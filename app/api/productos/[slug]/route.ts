import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  let slug: string | undefined;

  try {
    // 1. Manejamos el bug de Turbopack (params es una Promise)
    const resolvedParams = await params;
    slug = resolvedParams.slug;

    if (!slug) {
      throw new Error("El slug no pudo ser resuelto.");
    }

    // 2. Buscamos el producto por su slug
    const producto = await prisma.producto.findUnique({
      where: {
        slug: slug,
      },
      include: {
        categoria: true, // Incluimos la categoría
      },
    });

    // 3. Si no se encuentra, devolvemos un 404
    if (!producto) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    // 4. Convertimos el precio (Decimal) a string para JSON
    const safeProducto = {
      ...producto,
      precio: producto.precio.toString(),
      categoria: producto.categoria ? producto.categoria : null, // Pasamos la categoría
    };

    return NextResponse.json(safeProducto);

  } catch (error) {
    console.error(`Error al obtener producto ${slug || 'desconocido'}:`, error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}