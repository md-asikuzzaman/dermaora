import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params;

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );

    const product = await prisma.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    const where = {
      productId: product.id,
      isApproved: true,
    };

    const [reviews, total, ratingDistribution] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.review.count({ where }),

      prisma.review.groupBy({
        by: ["rating"],
        where,
        _count: {
          rating: true,
        },
      }),
    ]);

    const totalRating = ratingDistribution.reduce(
      (sum, item) => sum + item.rating * item._count.rating,
      0,
    );

    const averageRating =
      total > 0 ? Number((totalRating / total).toFixed(1)) : 0;

    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const item = ratingDistribution.find((entry) => entry.rating === rating);

      const count = item?._count.rating ?? 0;

      return {
        rating,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        reviews,
        summary: {
          averageRating,
          totalReviews: total,
          distribution,
        },
      },
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get product reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
