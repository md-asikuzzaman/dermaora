import { isValidObjectId } from "@/lib/isObjectId";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { updateOrderStatusSchema } from "@/schema/order.schema";
import type { OrderStatusInput } from "@/schema/order.schema";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// Allowed order status transitions
const allowedTransitions: Record<OrderStatusInput, OrderStatusInput[]> = {
  PENDING: ["CONFIRMED"],
  CONFIRMED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    // Admin authorization
    // const unauthorized = await requireAdmin();
    // if (unauthorized) return unauthorized;

    const { id } = await params;

    // Validate order ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID",
        },
        { status: 400 },
      );
    }

    // Parse and validate request body
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body",
        },
        { status: 400 },
      );
    }

    const validation = updateOrderStatusSchema.safeParse(body);

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

    const { status, adminNote } = validation.data;

    // Find order
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
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

    // Prevent status changes while cancellation is pending
    if (order.cancellationStatus === "REQUESTED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order has a pending cancellation request. Review it before updating the order status.",
        },
        { status: 409 },
      );
    }

    // Check whether the requested transition is allowed
    const allowedStatuses = allowedTransitions[order.status];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot change order status from ${order.status} to ${status}`,
        },
        { status: 400 },
      );
    }

    // Update order status with concurrency protection
    const result = await prisma.order.updateMany({
      where: {
        id,
        status: order.status,
        cancellationStatus: {
          not: "REQUESTED",
        },
      },
      data: {
        status,
        ...(adminNote !== undefined ? { adminNote } : {}),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order status could not be updated. It may have changed already.",
        },
        { status: 409 },
      );
    }

    // Fetch updated order
    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        cancellationStatus: true,
        adminNote: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update order status error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
      },
      { status: 500 },
    );
  }
}
