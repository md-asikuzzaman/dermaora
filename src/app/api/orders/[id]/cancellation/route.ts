import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { reviewCancellationSchema } from "@/schema/order.schema";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    // Admin authorization
    // const unauthorized = await requireAdmin();

    // if (unauthorized) return unauthorized;

    const { id } = await params;

    // Validate order ID
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID",
        },
        { status: 400 },
      );
    }

    // Parse and validate request body
    const body = await request.json();

    const validation = reviewCancellationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0].message,
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { action, adminNote } = validation.data;

    // Find order
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        items: true,
        paymentMethod: true,
        paymentStatus: true,
        cancellationStatus: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    // Check cancellation request
    if (order.cancellationStatus !== "REQUESTED") {
      return NextResponse.json(
        {
          success: false,
          message: "No pending cancellation request found",
        },
        { status: 409 },
      );
    }

    // Check order eligibility
    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "This order is no longer eligible for cancellation",
        },
        { status: 400 },
      );
    }

    // Handle rejection
    if (action === "REJECT") {
      const result = await prisma.order.updateMany({
        where: {
          id,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
          cancellationStatus: "REQUESTED",
        },
        data: {
          cancellationStatus: "REJECTED",
          cancellationReviewedAt: new Date(),
          ...(adminNote !== undefined ? { adminNote } : {}),
        },
      });

      if (result.count === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Cancellation request has already been reviewed",
          },
          { status: 409 },
        );
      }

      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          cancellationStatus: true,
          cancellationReason: true,
          cancellationRequestedAt: true,
          cancellationReviewedAt: true,
          adminNote: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Cancellation request rejected successfully",
          data: updatedOrder,
        },
        { status: 200 },
      );
    }

    // Approve cancellation
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Conditional update prevents duplicate approval
      const result = await tx.order.updateMany({
        where: {
          id,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
          cancellationStatus: "REQUESTED",
        },
        data: {
          status: "CANCELLED",
          cancellationStatus: "APPROVED",
          cancellationReviewedAt: new Date(),
          ...(adminNote !== undefined ? { adminNote } : {}),
        },
      });

      if (result.count === 0) {
        throw new Error("Cancellation request has already been processed");
      }

      // Restore product stock
      for (const item of order.items) {
        const product = await tx.product.updateMany({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });

        // Ensure the referenced product exists
        if (product.count === 0) {
          throw new Error(
            `Product not found while restoring stock: ${item.productId}`,
          );
        }
      }

      // Return updated order
      return tx.order.findUnique({
        where: { id },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          cancellationStatus: true,
          cancellationReason: true,
          cancellationRequestedAt: true,
          cancellationReviewedAt: true,
          adminNote: true,
          updatedAt: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order cancellation approved successfully",
        data: updatedOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Review order cancellation error:", error);

    if (
      error instanceof Error &&
      error.message === "Cancellation request has already been processed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to review cancellation request",
      },
      { status: 500 },
    );
  }
}
