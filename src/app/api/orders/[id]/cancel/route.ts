import { isValidObjectId } from "@/lib/isObjectId";
import { prisma } from "@/lib/prisma";
import { cancelOrderSchema } from "@/schema/order.schema";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    console.log(id);

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
    const body = await request.json();

    const validation = cancelOrderSchema.safeParse(body);

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

    const { phone, reason } = validation.data;

    // Normalize phone numbers
    const normalizePhone = (value: string) => value.replace(/\D/g, "");

    // Find order
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        cancellationStatus: true,
        shippingAddress: {
          select: {
            phone: true,
          },
        },
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

    // Verify customer phone
    if (normalizePhone(order.shippingAddress.phone) !== normalizePhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number does not match this order",
        },
        { status: 403 },
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

    // Prevent duplicate cancellation requests
    if (order.cancellationStatus === "REQUESTED") {
      return NextResponse.json(
        {
          success: false,
          message: "Cancellation request has already been submitted",
        },
        { status: 409 },
      );
    }

    // Submit cancellation request safely
    const result = await prisma.order.updateMany({
      where: {
        id,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        cancellationStatus: {
          not: "REQUESTED",
        },
      },
      data: {
        cancellationStatus: "REQUESTED",
        cancellationReason: reason,
        cancellationRequestedAt: new Date(),
        cancellationReviewedAt: null,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cancellation request could not be submitted. Please try again.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cancellation request submitted successfully",
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          cancellationStatus: "REQUESTED",
          cancellationReason: reason,
          cancellationRequestedAt: new Date(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Cancel order request error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit cancellation request",
      },
      { status: 500 },
    );
  }
}
