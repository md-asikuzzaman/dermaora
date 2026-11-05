import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Brands fetched successfully",
      data: brands,
    });
  } catch (error) {
    console.error("Get brands error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch brands" },
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
    const { name, slug, description, logo, website } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 },
      );
    }

    const normalizedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        slug: normalizedSlug,
        description: description?.trim() || null,
        logo: logo?.trim() || null,
        website: website?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Brand created successfully",
        data: brand,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create brand error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "Brand name or slug already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create brand" },
      { status: 500 },
    );
  }
}
