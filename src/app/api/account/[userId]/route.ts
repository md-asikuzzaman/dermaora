import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { isValidObjectId } from "@/lib/isObjectId";
import { auth } from "@/lib/auth";
import { updateAccountSchema } from "@/schema/account.schema";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    // 1. Authenticate user
    // const session = await auth();

    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Unauthorized. Please login first.",
    //     },
    //     { status: 401 },
    //   );
    // }

    // 2. Get user ID from URL
    const { userId } = await params;

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID.",
        },
        { status: 400 },
      );
    }

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    // 4. Ensure the requested account belongs to the logged-in user
    // if (user.email.toLowerCase() !== session.user.email.toLowerCase()) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "You are not authorized to access this account.",
    //     },
    //     { status: 403 },
    //   );
    // }

    // 5. Find orders using shipping email
    const orders = await prisma.order.findMany({
      where: {
        shippingAddress: {
          is: {
            email: user.email,
          },
        },
      },
      select: {
        status: true,
      },
    });

    // 6. Calculate order summary
    const orderSummary: Record<string, number> = {
      total: orders.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    };

    orders.forEach((order) => {
      const status = order.status.toLowerCase();

      if (status in orderSummary) {
        orderSummary[status] += 1;
      }
    });

    // 7. Return account information
    return NextResponse.json({
      success: true,
      message: "Account information fetched successfully.",
      data: {
        user,
        orderSummary,
      },
    });
  } catch (error) {
    console.error("[ACCOUNT_GET]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch account information.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    // 1. Authentication
    // const session = await auth();

    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Unauthorized. Please login first.",
    //     },
    //     { status: 401 },
    //   );
    // }

    // 2. Get user ID
    const { userId } = await params;

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID.",
        },
        { status: 400 },
      );
    }

    // 3. Find authenticated user
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    // if (existingUser.email.toLowerCase() !== session.user.email.toLowerCase()) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "You are not authorized to update this account.",
    //     },
    //     { status: 403 },
    //   );
    // }

    // 4. Validate request body
    const body: unknown = await request.json();
    const parsed = updateAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, phone } = parsed.data;
    const normalizedPhone = phone || null;

    // 5. Check duplicate phone number
    if (normalizedPhone) {
      const phoneExists = await prisma.user.findFirst({
        where: {
          phone: normalizedPhone,
          id: { not: userId },
        },
        select: { id: true },
      });

      if (phoneExists) {
        return NextResponse.json(
          {
            success: false,
            message: "This phone number is already in use.",
          },
          { status: 409 },
        );
      }
    }

    // 6. Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone: normalizedPhone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    // 7. Success response
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("[ACCOUNT_PATCH]", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This phone number is already in use.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile.",
      },
      { status: 500 },
    );
  }
}
