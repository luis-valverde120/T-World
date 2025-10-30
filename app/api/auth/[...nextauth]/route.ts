import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // <<< 1. IMPORTA
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Asegúrate de usar el correcto
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'; // <<< 2. IMPORTA BCRYPT
import { AdapterUser } from "next-auth/adapters";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {

  adapter: {
    ...PrismaAdapter(prisma), // Importa todas las funciones (getUser, linkAccount, etc.)

    // ...PERO sobrescribe la función createUser
    createUser: async (data: Omit<AdapterUser, "id">) => {
      // 1. Crear el usuario en tu BD con el campo 'nombre'
      const createdUser = await prisma.user.create({
        data: {
          nombre: <string>data.name, 
          email: data.email,
          image: data.image,
          emailVerified: data.emailVerified,
        },
      });

      // 2. Devolver un AdapterUser "traducido" de vuelta para NextAuth
      // NextAuth espera un objeto con 'name', no 'nombre'
      return {
        id: createdUser.id,
        email: createdUser.email!, 
        emailVerified: createdUser.emailVerified,
        name: createdUser.nombre, 
        image: createdUser.image,
        role: createdUser.rol,
      };
    },
  },

  // 3. ACTUALIZA LOS PROVIDERS
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials", // Nombre que se mostrará
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      // Esta función es la que valida al usuario
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email y contraseña requeridos");
        }

        // 1. Buscar al usuario en la BD
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 2. Si no existe O si no tiene contraseña (es usuario de Google)
        if (!user || !user.password) {
          throw new Error("Usuario no encontrado o registrado con Google");
        }

        // 3. Comparar las contraseñas
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        // 4. Si todo bien, devuelve el usuario (sin contraseña)
        // El 'role' se añadirá al token/sesión en los callbacks
        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
          image: user.image,
          role: user.rol, // Pasa el rol
        };
      },
    }),
  ],

  // 4. AÑADE LA PÁGINA DE LOGIN PERSONALIZADA
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error', // (opcional)
    // verifyRequest: '/auth/verify-request', // (opcional)
    // newUser: '/register' // (opcional)
  },

  session: {
    strategy: "jwt",
  },

  // ...TUS CALLBACKS (session y jwt) DEBEN QUEDARSE IGUAL...
  // (Estos ya están listos para manejar 'role' de cualquier proveedor)
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) { 
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role || user.rol; // 'user.role' de Credentials, 'user.rol' de Prisma
        token.name = user.name;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };