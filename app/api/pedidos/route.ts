import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
// Asegúrate de que esta ruta a tus authOptions sea correcta
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 1. Autenticación: Verificamos quién es el usuario
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      // Si no está logueado, no puede tener pedidos
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // 2. Buscar TODOS los pedidos que coincidan con el ID del usuario
    const pedidos = await prisma.pedido.findMany({
      where: {
        usuarioId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc', // Opcional: mostrar los más recientes primero
      }
    });

    // 3. Convertir el tipo 'Decimal' a 'string' (seguro para JSON)
    const safePedidos = pedidos.map(pedido => ({
      ...pedido,
      total: pedido.total.toString(),
    }));

    // 4. Devolver la lista de pedidos
    return NextResponse.json(safePedidos);

  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}