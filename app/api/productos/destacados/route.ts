import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      // Tomamos los 10 más nuevos
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      // Incluimos la categoría para poder mostrar su nombre
      include: {
        categoria: true,
      },
    });

    // Convertimos los datos para que sean seguros para JSON
    const safeProductos = productos.map(p => ({
      ...p,
      precio: p.precio.toString(), // Convertimos 'Decimal' a 'string'
      slug: p.slug,
      // Si por alguna razón un producto no tiene categoría (debería), evitamos un error
      categoria: p.categoria ? p.categoria.nombre : "Sin categoría",
    }));

    return NextResponse.json(safeProductos);

  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}