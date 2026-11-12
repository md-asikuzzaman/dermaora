import { prisma } from "@/lib/prisma";
import { trackOrderSchema } from "@/schema/order.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 1. Get order number
    const searchParams = request.nextUrl.searchParams;

    const validation = trackOrderSchema.safeParse({
      orderNumber: searchParams.get("orderNumber"),
    });

    // 2. Validate query
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

    const { orderNumber } = validation.data;

    // 3. Find order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
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

    // 4. Return tracking information
    const trackingData = {
      id: order.id,
      orderNumber: order.orderNumber,

      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,

      items: order.items,

      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      discount: order.discount,
      total: order.total,
      currency: order.currency,

      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        city: order.shippingAddress.city,
        district: order.shippingAddress.district,
      },

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Order tracking information fetched successfully",
        data: trackingData,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Track order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to track order",
      },
      { status: 500 },
    );
  }
}
