import { signIn } from "@/auth";
import { ADMIN_PASS } from "@/lib/admin";
import { verifyPassword } from "@/lib/bcryptjs";
import prisma from "@/lib/db";
import { userType } from "@/types/common";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { role, email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }
    const roleUpperCase = role.toUpperCase() || "ADMIN";

    let checkUserExist;

    if (roleUpperCase === userType.ADMIN) {
      if (email !== process.env.ADMIN_EMAIL)
        return new NextResponse("You're not authorized to access the system", {
          status: 400,
        });
      checkUserExist = {
        id: "admin",
        email: process.env.ADMIN_EMAIL,
        name: "Admin",
        password: ADMIN_PASS,
      };
    } else {
      checkUserExist = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          password: true,
        },
      });
    }

    if (!checkUserExist) {
      return new NextResponse("User doesn't exist on the system", {
        status: 404,
      });
    }

    const verifyPass = await verifyPassword(password, checkUserExist.password);
    if (!verifyPass) {
      return new NextResponse("Invalid password", {
        status: 401,
      });
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
      role: roleUpperCase,
    });

    return new NextResponse("Login Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
