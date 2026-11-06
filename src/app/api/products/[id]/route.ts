import { auth } from "@/lib/auth";
import { isValidObjectId } from "@/lib/isObjectId";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/schema/product.schema";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
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

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    // const unauthorized = await requireAdmin();
    // if (unauthorized) return unauthorized;

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    const body = await request.json();

    const validation = updateProductSchema.safeParse(body);

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

    const { brandId, categoryId, ...data } = validation.data;

    if (Object.keys(validation.data).length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one field is required" },
        { status: 400 },
      );
    }

    // Validate final price and sale price
    const finalPrice = data.price ?? existingProduct.price;

    const finalSalePrice =
      data.salePrice !== undefined ? data.salePrice : existingProduct.salePrice;

    if (finalSalePrice !== null && finalSalePrice >= finalPrice) {
      return NextResponse.json(
        { success: false, message: "Sale price must be lower than price" },
        { status: 400 },
      );
    }

    // Check brand
    if (brandId !== undefined) {
      const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        select: { id: true },
      });

      if (!brand) {
        return NextResponse.json(
          { success: false, message: "Brand not found" },
          { status: 404 },
        );
      }
    }

    // Check category
    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 },
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(brandId !== undefined && {
          brand: { connect: { id: brandId } },
        }),
        ...(categoryId !== undefined && {
          category: { connect: { id: categoryId } },
        }),
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name, slug or SKU already exists",
        },
        { status: 409 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 },
    );
  }
}
export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 },
      );
    }

    const product = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Delete product error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 },
    );
  }
}
