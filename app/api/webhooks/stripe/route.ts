import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { FacturaEmail } from '@/components/emails/FacturaEmail'; // Importa tu template

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover', // O tu versión
});
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // 1. Leemos el cuerpo del request (no como JSON)
  const body = await request.text();
  // 2. Leemos la firma de Stripe desde los headers
  const signature = request.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  // 3. Verificamos que el mensaje es de Stripe (seguridad)
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error de Webhook: ${err.message}`);
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 4. Manejamos el evento 'checkout.session.completed'
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // 5. Obtenemos los datos que guardamos
    const orderId = session.metadata?.orderId;
    const userEmail = session.customer_details?.email;

    if (!orderId || !userEmail) {
      console.error("❌ Webhook Error: Falta orderId o email en la sesión.");
      return NextResponse.json({ message: "Datos de sesión incompletos" }, { status: 400 });
    }

    try {
      // 6. ACTUALIZAR TU BASE DE DATOS
      // Marcamos el pedido como PAGADO
      const pedido = await prisma.pedido.update({
        where: { id: orderId },
        data: { estado: 'PAGADO' },
        include: { // Incluimos todo para la factura
          usuario: true, 
          items: {
            include: {
              producto: true
            }
          }
        }
      });

      // 7. ENVIAR EL CORREO CON RESEND
      await resend.emails.send({
        from: 'T-World <ventas@tudominio.com>', // Debes configurar esto en Resend
        to: userEmail,
        subject: `Confirmación de tu pedido en T-World #${pedido.id.substring(0, 6)}`,
        react: FacturaEmail({ pedido }), // Usamos nuestro template
      });

      console.log(`✅ Pedido ${orderId} actualizado y correo enviado a ${userEmail}`);

    } catch (err: any) {
      console.error("Error al procesar el webhook:", err);
      return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
  }

  // 8. Respondemos a Stripe con un 200 OK
  return NextResponse.json({ received: true }, { status: 200 });
}