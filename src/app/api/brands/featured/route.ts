import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Featured brands fetched successfully",
      data: brands,
    });
  } catch (error) {
    console.error("Get featured brands error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch featured brands" },
      { status: 500 },
    );
  }
}
