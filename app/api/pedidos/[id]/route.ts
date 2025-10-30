import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  let id: string | undefined;

  // 1. Autenticación
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {

    const resolvedParams = await params;
    id = resolvedParams.id;

    if (!id) {
      throw new Error("El ID del pedido no se pudo resolver.");
    }

    const pedido = await prisma.pedido.findUnique({
      where: { id: id },
      include: {
        items: { // Traemos los items...
          include: {
            producto: true // ...y los detalles del producto
          }
        }
      }
    });

    if (!pedido) {
      return NextResponse.json({ message: "Pedido no encontrado" }, { status: 404 });
    }
    
    // 2. Seguridad: Asegurarse de que el usuario solo vea SUS pedidos
    if (pedido.usuarioId !== session.user.id) {
      return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
    }

    // 3. Convertir Decimales
    const safePedido = {
      ...pedido,
      total: pedido.total.toString(),
      items: pedido.items.map(item => ({
        ...item,
        precioUnidad: item.precioUnidad.toString(),
        producto: {
          ...item.producto,
          precio: item.producto.precio.toString(),
        }
      }))
    };

    return NextResponse.json(safePedido);

  } catch (error) {
    console.error("Error al obtener pedido:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}