import { isValidObjectId } from "@/lib/isObjectId";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID",
        },
        { status: 400 },
      );
    }

    // Find order
    const order = await prisma.order.findUnique({
      where: {
        id,
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

    // Prepare order details
    const orderDetails = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,

      items: order.items,

      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      discount: order.discount,
      total: order.total,
      currency: order.currency,

      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paidAt: order.paidAt,

      // Cancellation information
      cancellationStatus: order.cancellationStatus,
      cancellationReason: order.cancellationReason,
      cancellationRequestedAt: order.cancellationRequestedAt,
      cancellationReviewedAt: order.cancellationReviewedAt,

      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        email: order.shippingAddress.email,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        district: order.shippingAddress.district,
        postalCode: order.shippingAddress.postalCode,
        note: order.shippingAddress.note,
      },

      adminNote: order.adminNote,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Order details fetched successfully",
        data: orderDetails,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Get order details error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order details",
      },
      { status: 500 },
    );
  }
}
