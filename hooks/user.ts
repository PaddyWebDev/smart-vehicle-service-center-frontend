"use server";

import { auth, signOut } from "@/auth";
import prisma from "@/lib/db";
import { userType } from "@/types/common";
import { Role } from "@prisma/client";

export async function getSessionUser() {
  return await auth();
}

export async function signOutUser() {
  return await signOut();
}

export async function getTypeOfUser() {
  const session = await auth();
  return session?.user.role;
}

type FetchUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export async function getUserById(id: string): Promise<FetchUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });
  if (user) {
    return {
      id: id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } else return null;
}
