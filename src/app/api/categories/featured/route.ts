import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Featured categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get featured categories error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch featured categories" },
      { status: 500 },
    );
  }
}
