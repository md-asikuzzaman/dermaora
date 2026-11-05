import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidObjectId } from "@/lib/isObjectId";

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

    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      price,
      salePrice,
      stock,
      images,
      thumbnail,
      isFeatured,
      isActive,
      brandId,
      categoryId,
    } = body;

    const data: {
      name?: string;
      slug?: string;
      sku?: string;
      description?: string | null;
      shortDescription?: string | null;
      price?: number;
      salePrice?: number | null;
      stock?: number;
      images?: string[];
      thumbnail?: string | null;
      isFeatured?: boolean;
      isActive?: boolean;
      brand?: { connect: { id: string } };
      category?: { connect: { id: string } };
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { success: false, message: "Invalid product name" },
          { status: 400 },
        );
      }

      data.name = name.trim();
    }

    if (slug !== undefined) {
      if (typeof slug !== "string" || !slug.trim()) {
        return NextResponse.json(
          { success: false, message: "Invalid product slug" },
          { status: 400 },
        );
      }

      const normalizedSlug = slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      if (!normalizedSlug) {
        return NextResponse.json(
          { success: false, message: "Invalid product slug" },
          { status: 400 },
        );
      }

      data.slug = normalizedSlug;
    }

    if (sku !== undefined) {
      if (typeof sku !== "string" || !sku.trim()) {
        return NextResponse.json(
          { success: false, message: "Invalid product SKU" },
          { status: 400 },
        );
      }

      data.sku = sku.trim();
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return NextResponse.json(
          { success: false, message: "Invalid description" },
          { status: 400 },
        );
      }

      data.description = description?.trim() || null;
    }

    if (shortDescription !== undefined) {
      if (shortDescription !== null && typeof shortDescription !== "string") {
        return NextResponse.json(
          { success: false, message: "Invalid short description" },
          { status: 400 },
        );
      }

      data.shortDescription = shortDescription?.trim() || null;
    }

    if (price !== undefined) {
      if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid product price" },
          { status: 400 },
        );
      }

      data.price = price;
    }

    if (salePrice !== undefined) {
      if (
        salePrice !== null &&
        (typeof salePrice !== "number" ||
          !Number.isFinite(salePrice) ||
          salePrice < 0)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid sale price" },
          { status: 400 },
        );
      }

      data.salePrice = salePrice;
    }

    const finalPrice = data.price ?? existingProduct.price;
    const finalSalePrice =
      data.salePrice !== undefined ? data.salePrice : existingProduct.salePrice;

    if (finalSalePrice !== null && finalSalePrice >= finalPrice) {
      return NextResponse.json(
        { success: false, message: "Sale price must be lower than price" },
        { status: 400 },
      );
    }

    if (stock !== undefined) {
      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid product stock" },
          { status: 400 },
        );
      }

      data.stock = stock;
    }

    if (images !== undefined) {
      if (
        !Array.isArray(images) ||
        !images.every((image) => typeof image === "string")
      ) {
        return NextResponse.json(
          { success: false, message: "Images must be an array of strings" },
          { status: 400 },
        );
      }

      data.images = images;
    }

    if (thumbnail !== undefined) {
      if (thumbnail !== null && typeof thumbnail !== "string") {
        return NextResponse.json(
          { success: false, message: "Invalid thumbnail" },
          { status: 400 },
        );
      }

      data.thumbnail = thumbnail?.trim() || null;
    }

    if (isFeatured !== undefined) {
      if (typeof isFeatured !== "boolean") {
        return NextResponse.json(
          { success: false, message: "Invalid featured status" },
          { status: 400 },
        );
      }

      data.isFeatured = isFeatured;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return NextResponse.json(
          { success: false, message: "Invalid active status" },
          { status: 400 },
        );
      }

      data.isActive = isActive;
    }

    if (brandId !== undefined) {
      if (typeof brandId !== "string" || !isValidObjectId(brandId)) {
        return NextResponse.json(
          { success: false, message: "Invalid brand ID" },
          { status: 400 },
        );
      }

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

      data.brand = { connect: { id: brandId } };
    }

    if (categoryId !== undefined) {
      if (typeof categoryId !== "string" || !isValidObjectId(categoryId)) {
        return NextResponse.json(
          { success: false, message: "Invalid category ID" },
          { status: 400 },
        );
      }

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

      data.category = { connect: { id: categoryId } };
    }

    const product = await prisma.product.update({
      where: { id },
      data,
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
        { success: false, message: "Product name, slug or SKU already exists" },
        { status: 409 },
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
