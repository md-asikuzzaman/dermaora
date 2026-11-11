import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
