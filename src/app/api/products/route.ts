import { isValidObjectId } from "@/lib/isObjectId";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/schema/product.schema";
import { NextRequest, NextResponse } from "next/server";

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
      meta: {
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
    // const unauthorized = await requireAdmin();
    // if (unauthorized) return unauthorized;

    const body = await request.json();

    const validation = createProductSchema.safeParse(body);

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
    } = validation.data;

    // Check brand and category
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

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description: description || null,
        shortDescription: shortDescription || null,
        price,
        salePrice: salePrice ?? null,
        stock,
        images,
        thumbnail: thumbnail || null,
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
        {
          success: false,
          message: "Product name, slug or SKU already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 },
    );
  }
}
