import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// El 'params' viene de la URL (ej. /api/categorias/anime)
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    let slug: string | undefined;

    const resolvedParams = await params;

    slug = resolvedParams.slug;

    // 3. Si slug sigue siendo undefined, es un error
    if (!slug) {
      throw new Error("El slug no pudo ser resuelto desde los parámetros.");
    }

    // 1. Buscamos la categoría por su 'slug'
    const categoria = await prisma.categoria.findUnique({
      where: {
        slug: slug,
      },
      include: {
        productos: true, // Incluimos los productos
      },
    });

    // 2. Si no se encuentra, devolvemos un 404
    if (!categoria) {
      return NextResponse.json({ message: "Categoría no encontrada" }, { status: 404 });
    }

    // 3. ¡IMPORTANTE! Convertimos 'Decimal' a 'string'
    // El tipo 'Decimal' de Prisma no se puede enviar por JSON.
    const safeProductos = categoria.productos.map(p => ({
      ...p,
      precio: p.precio.toString(), // Convertimos el precio a string
    }));

    const safeCategoria = {
      ...categoria,
      productos: safeProductos,
    };

    // 4. Devolvemos la categoría y sus productos
    return NextResponse.json(safeCategoria);

  } catch (error) {
    console.error(`Error al obtener categoría ${params.slug}:`, error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}