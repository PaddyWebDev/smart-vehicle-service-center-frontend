import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import prisma from "./lib/db";
import { verifyPassword } from "./lib/bcryptjs";
import { ADMIN_PASS } from "./lib/admin";
import { userType } from "./types/common";

const AuthConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials: any) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.role
        ) {
          return null;
        }
        let user;

        if (credentials.role === userType.ADMIN) {
          if (credentials.email !== process.env.ADMIN_PASS) {
            return null;
          }

          user = {
            id: "admin",
            email: credentials.email,
            name: "Admin",
            password: ADMIN_PASS,
          };
        } else {
          user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
              role: credentials.role,
            },
          });
        }

        if (!user) return null;

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: credentials.role,
        };
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
} satisfies NextAuthConfig;

export default AuthConfig;
