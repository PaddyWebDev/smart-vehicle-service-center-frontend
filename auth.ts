import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import { getUserById } from "./hooks/user";
import AuthConfig from "./auth.config";
import { Role } from "@prisma/client";
import type { Adapter } from 'next-auth/adapters';

export type ExtendedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};


declare module "next-auth" {
  interface Session {
    user: ExtendedUser & DefaultSession["user"];
  }

  interface User extends ExtendedUser {} // Safe now
}



declare module "next-auth/jwt" {
  interface JWT extends ExtendedUser {} // For JWT token (client + server consistency)
}
export const {
  auth,
  signOut,
  signIn,
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: "/guest/Login",
    error: "/guest/error",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user) return false;
      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        return token;
      }
      if (!token.sub) return token;

      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      let existingUser;

      if (token.role === Role.ADMIN) {
        existingUser = {
          id: "admin",
          name: "Admin",
          email: process.env.ADMIN_EMAIL,
          role: "ADMIN" as const,
        };
      } else {
        existingUser = await prisma.user.findUnique({
          where: {
            email: token?.email!,
            role: token?.role!,
          },
        });
      }

      if (!existingUser) return token;

      // token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },

  providers: [...AuthConfig.providers],
  secret: process.env.NEXT_AUTH_SECRET,
});

