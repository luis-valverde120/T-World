// types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import { Role } from "@prisma/client"; // Importa tu enum 'Role' desde Prisma

// Extiende el tipo JWT
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
  }
}

// Extiende el tipo Session
declare module "next-auth" {
  // Extiende el objeto 'user' dentro de 'session'
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"]; // Mantiene las propiedades originales (name, email, image)
  }

  // Extiende el objeto 'user' por defecto (el que viene de la BD)
  interface User extends DefaultUser {
    role?: Role;
  }
}