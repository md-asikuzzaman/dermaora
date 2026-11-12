import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/schema/order.schema";
import { NextRequest, NextResponse } from "next/server";

// Configure your delivery policy here.
// Keep 0 until your delivery fee rules are defined.
const DELIVERY_FEE = 0;
const DISCOUNT = 0;

class OrderError extends Error {
  constructor(
    message: string,
    public status: number = 400,
  ) {
    super(message);
    this.name = "OrderError";
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }

    // 2. Validate request
    const validation = createOrderSchema.safeParse(body);

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

    const { items, shippingAddress, paymentMethod } = validation.data;

    // 3. Merge duplicate product IDs
    const quantityMap = new Map<string, number>();

    for (const item of items) {
      const currentQuantity = quantityMap.get(item.productId) ?? 0;

      quantityMap.set(item.productId, currentQuantity + item.quantity);
    }

    const requestedItems = Array.from(quantityMap, ([productId, quantity]) => ({
      productId,
      quantity,
    }));

    // 4. Create order and update stock atomically
    const order = await prisma.$transaction(async (tx) => {
      // Fetch actual products from database
      const products = await tx.product.findMany({
        where: {
          id: {
            in: requestedItems.map((item) => item.productId),
          },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          sku: true,
          price: true,
          salePrice: true,
          stock: true,
          thumbnail: true,
        },
      });

      // Check all requested products exist and are active
      if (products.length !== requestedItems.length) {
        throw new OrderError("One or more products are unavailable", 404);
      }

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      // 5. Validate stock and calculate order items
      let subtotal = 0;

      const orderItems = requestedItems.map((item) => {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new OrderError("Product not found", 404);
        }

        if (product.stock < item.quantity) {
          throw new OrderError(
            `${product.name} has only ${product.stock} items available`,
            400,
          );
        }

        const currentPrice = product.salePrice ?? product.price;

        if (!Number.isFinite(currentPrice) || currentPrice < 0) {
          throw new OrderError(`Invalid price for ${product.name}`, 400);
        }

        const itemSubtotal = currentPrice * item.quantity;

        subtotal += itemSubtotal;

        return {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          thumbnail: product.thumbnail,
          price: product.price,
          salePrice: product.salePrice,
          quantity: item.quantity,
          subtotal: itemSubtotal,
        };
      });

      // 6. Calculate final amount
      const total = Math.max(0, subtotal + DELIVERY_FEE - DISCOUNT);

      // 7. Deduct stock with conditional updates
      // Prevent overselling when concurrent orders happen.
      for (const item of requestedItems) {
        const stockUpdate = await tx.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new OrderError("Product stock changed. Please try again.", 409);
        }
      }

      // 8. Create order
      const newOrder = await tx.order.create({
        data: {
          shippingAddress: {
            ...shippingAddress,
            email: shippingAddress.email || undefined,
          },

          items: orderItems,

          subtotal,
          deliveryFee: DELIVERY_FEE,
          discount: DISCOUNT,
          total,

          paymentMethod,

          paymentStatus: paymentMethod === "STRIPE" ? "PENDING" : "UNPAID",
        },
      });

      return newOrder;
    });

    // 9. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create order error:", error);

    if (error instanceof OrderError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.status },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Order already exists. Please try again.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      { status: 500 },
    );
  }
}
