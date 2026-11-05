import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schema/auth.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /** Validate request */
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;

    /** Check existing user */
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 },
      );
    }

    /** Hash password */
    const hashedPassword = await hash(password, 12);

    /** Create user */
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    /** Return response */
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: user,
      },
      { status: 201 },
    );
  } catch (error) {
    /** Handle duplicate email race condition */
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
