import { hashPassword } from "@/lib/bcryptjs";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phoneNumber, role } = await request.json();

    if (!name || !email || !password || !phoneNumber || !role) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    let checkUserExist = await prisma.user.findUnique({
      where: {
        email,
        phoneNumber,
      },
    });

    if (checkUserExist)
      return new NextResponse("User already exist", { status: 409 });

    if (role === Role.CUSTOMER) {
      const role = Role.CUSTOMER;
      await prisma.user.create({
        data: {
          email,
          name,
          role,
          phoneNumber,
          password: await hashPassword(password),
        },
      });
    } else {
      const role = Role.SERVICE_CENTER;
      const data = await prisma.user.create({
        data: {
          email,
          name,
          role,
          phoneNumber,
          password: await hashPassword(password),
        },
      });

      await prisma.serviceCenter.create({
        data: {
          userId: data.id,
        },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
