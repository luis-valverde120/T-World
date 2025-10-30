import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client'; // Importa 'Prisma' para tipos

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search'); // ?search=...
    const categorySlug = searchParams.get('category'); // ?category=...

    // 1. Prepara el filtro dinámico para Prisma
    const where: Prisma.ProductoWhereInput = {};

    // 2. Si hay un 'searchQuery', añade un filtro de nombre
    if (searchQuery) {
      where.nombre = {
        contains: searchQuery,
        mode: 'insensitive', // No distingue mayúsculas/minúsculas
      };
    }

    // 3. Si hay un 'categorySlug', filtra por la relación
    if (categorySlug) {
      where.categoria = {
        slug: categorySlug,
      };
    }

    // 4. Ejecuta la consulta con los filtros
    const productos = await prisma.producto.findMany({
      where: where,
      include: {
        categoria: true, // Incluye el nombre de la categoría
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 5. Convierte los precios (Decimal) a string para JSON
    const safeProductos = productos.map(p => ({
      ...p,
      precio: p.precio.toString(),
      slug: p.slug,
      categoria: p.categoria ? p.categoria.nombre : "Sin categoría",
    }));

    return NextResponse.json(safeProductos);

  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}