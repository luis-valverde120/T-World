import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// Inicializa Stripe con tu llave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover', // <-- CORREGIDO
});

const prisma = new PrismaClient();

// Definimos el tipo de item que esperamos recibir del frontend
interface CartItem {
  id: string;
  nombre: string;
  precio: number; // El precio como número
  quantity: number;
  talla: string;
  color: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // 1. Obtenemos los items del carrito desde el body
    const { items } = (await request.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "El carrito está vacío" }, { status: 400 });
    }

    // 2. Transformamos los items al formato que Stripe Checkout espera
    

    const total = items.reduce((acc, item) => {
      return acc + (item.precio * item.quantity);
    }, 0);

    const nuevoPedido = await prisma.pedido.create({
      data: {
        usuarioId: userId,
        total: total, // Guardamos el total
        estado: 'PENDIENTE', // El pago aún no se completa
        // (Aquí podrías añadir la 'direccionEnvio' si la tuvieras)
        items: {
          // Creamos los 'ItemPedido' asociados
          create: items.map(item => ({
            productoId: item.id,
            cantidad: item.quantity,
            precioUnidad: item.precio, // Precio en el momento de la compra
            talla: item.talla,
            color: item.color,
          })),
        },
      },
    });

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.nombre} (Talla: ${item.talla}, Color: ${item.color})`,
        },
        unit_amount: Math.round(item.precio * 100),
      },
      quantity: item.quantity,
    }));

    // 3. Definimos las URLs de éxito y cancelación
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    // 4. Creamos la Sesión de Checkout en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      metadata: {
        orderId: nuevoPedido.id, 
      },
      success_url: `${origin}/pago/exito?order_id=${nuevoPedido.id}`, // Página a la que irá si el pago es exitoso
      cancel_url: `${origin}/pago/cancelado`, // Página a la que irá si cancela
      //automatic_tax: { enabled: true }, // Opcional: para impuestos
    });

    if (!session.url) {
      return NextResponse.json(
        { message: "Stripe no devolvió una URL de sesión" }, 
        { status: 500 }
      );
    }

    // 5. Devolvemos el ID de la sesión al frontend
    // 5. Devolvemos la URL completa al frontend
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Error al crear sesión de Stripe:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", error: (error as Error).message },
      { status: 500 }
    );
  }
}