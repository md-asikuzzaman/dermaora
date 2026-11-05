import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidObjectId } from "@/lib/isObjectId";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const brandId = searchParams.get("brandId");
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured");
    const isActive = searchParams.get("isActive");

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );

    if (brandId && !isValidObjectId(brandId)) {
      return NextResponse.json(
        { success: false, message: "Invalid brand ID" },
        { status: 400 },
      );
    }

    if (categoryId && !isValidObjectId(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 },
      );
    }

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { sku: { contains: search } },
        ],
      }),
      ...(brandId && { brandId }),
      ...(categoryId && { categoryId }),
      ...(isFeatured !== null &&
        ["true", "false"].includes(isFeatured) && {
          isFeatured: isFeatured === "true",
        }),
      ...(isActive !== null &&
        ["true", "false"].includes(isActive) && {
          isActive: isActive === "true",
        }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // const session = await auth();

    // if (session?.user?.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: 401 },
    //   );
    // }

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

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof sku !== "string" ||
      !sku.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Name, slug and SKU are required" },
        { status: 400 },
      );
    }

    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a valid positive number" },
        { status: 400 },
      );
    }

    if (
      salePrice !== undefined &&
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

    if (salePrice !== undefined && salePrice !== null && salePrice >= price) {
      return NextResponse.json(
        { success: false, message: "Sale price must be lower than price" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { success: false, message: "Stock must be a non-negative integer" },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(images) ||
      !images.every((image) => typeof image === "string")
    ) {
      return NextResponse.json(
        { success: false, message: "Images must be an array of strings" },
        { status: 400 },
      );
    }

    if (
      typeof brandId !== "string" ||
      !isValidObjectId(brandId) ||
      typeof categoryId !== "string" ||
      !isValidObjectId(categoryId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid brand and category IDs are required",
        },
        { status: 400 },
      );
    }

    if (isFeatured !== undefined && typeof isFeatured !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid featured status" },
        { status: 400 },
      );
    }

    if (isActive !== undefined && typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid active status" },
        { status: 400 },
      );
    }

    const [brand, category] = await Promise.all([
      prisma.brand.findUnique({
        where: { id: brandId },
        select: { id: true },
      }),
      prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      }),
    ]);

    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 },
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    const normalizedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: normalizedSlug,
        sku: sku.trim(),
        description: description?.trim() || null,
        shortDescription: shortDescription?.trim() || null,
        price,
        salePrice: salePrice ?? null,
        stock,
        images,
        thumbnail: thumbnail?.trim() || null,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        brand: { connect: { id: brandId } },
        category: { connect: { id: categoryId } },
      },
      include: {
        brand: true,
        category: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create product error:", error);

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
      { success: false, message: "Failed to create product" },
      { status: 500 },
    );
  }
}
