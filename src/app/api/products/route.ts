import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/schema/product.schema";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Search
    const search = searchParams.get("search")?.trim();

    // Brand and category slugs (multiple values)
    const brandSlugs = [
      ...new Set(searchParams.getAll("brand").filter(Boolean)),
    ];

    const categorySlugs = [
      ...new Set(searchParams.getAll("category").filter(Boolean)),
    ];

    // Boolean filters
    const isFeatured = searchParams.get("isFeatured");
    const isActive = searchParams.get("isActive");

    // Price filters
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    const minPrice =
      minPriceParam !== null && minPriceParam.trim() !== ""
        ? Number(minPriceParam)
        : undefined;

    const maxPrice =
      maxPriceParam !== null && maxPriceParam.trim() !== ""
        ? Number(maxPriceParam)
        : undefined;

    // Rating filters
    const ratings = [
      ...new Set(
        searchParams
          .getAll("rating")
          .map(Number)
          .filter(
            (rating) => Number.isInteger(rating) && rating >= 1 && rating <= 5,
          ),
      ),
    ];

    // Pagination
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 12),
    );

    // Sorting
    const sort = searchParams.get("sort") || "newest";

    // Validate price range
    if (
      (minPrice !== undefined && !Number.isFinite(minPrice)) ||
      (maxPrice !== undefined && !Number.isFinite(maxPrice))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid price range",
        },
        { status: 400 },
      );
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum price cannot exceed maximum price",
        },
        { status: 400 },
      );
    }

    // Build Prisma where conditions
    const where: Prisma.ProductWhereInput = {
      // Search
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),

      // Brand slug filter
      ...(brandSlugs.length > 0 && {
        brand: {
          is: {
            slug: {
              in: brandSlugs,
            },
          },
        },
      }),

      // Category slug filter
      ...(categorySlugs.length > 0 && {
        category: {
          is: {
            slug: {
              in: categorySlugs,
            },
          },
        },
      }),

      // Featured filter
      ...(isFeatured === "true" || isFeatured === "false"
        ? { isFeatured: isFeatured === "true" }
        : {}),

      // Active filter
      ...(isActive === "true" || isActive === "false"
        ? { isActive: isActive === "true" }
        : {}),

      // Price range
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),

      // Rating filter
      // Example: rating=4 means rating >= 4
      ...(ratings.length > 0 && {
        rating: {
          gte: Math.min(...ratings),
        },
      }),
    };

    // Sorting options
    const sortOptions: Record<string, Prisma.ProductOrderByWithRelationInput> =
      {
        newest: { createdAt: "desc" },
        oldest: { createdAt: "asc" },
        "price-asc": { price: "asc" },
        "price-desc": { price: "desc" },
        rating: { rating: "desc" },
        name: { name: "asc" },
      };

    const orderBy = sortOptions[sort] || sortOptions.newest;

    // Fetch products and total count
    const [products, total, priceRange] = await Promise.all([
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
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.product.count({ where }),

      // Get global price range without applied price filters
      prisma.product.aggregate({
        where: {
          isActive: true,
        },
        _min: {
          price: true,
        },
        _max: {
          price: true,
        },
      }),
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

        minPrice: priceRange._min.price ?? 0,
        maxPrice: priceRange._max.price ?? 0,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
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
