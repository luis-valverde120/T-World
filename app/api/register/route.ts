// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, nombre, password } = await request.json();

    // 1. Validar que los datos llegaron
    if (!email || !nombre || !password) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // 2. Revisar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'El email ya está en uso' }, { status: 409 });
    }

    // 3. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12); // 12 "salt rounds"

    // 4. Crear el nuevo usuario
    const user = await prisma.user.create({
      data: {
        email,
        nombre,
        password: hashedPassword,
        // 'rol' será CLIENTE por defecto (como definiste en tu schema)
      },
    });

    // 5. Devolver el usuario creado (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}