import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug } = body;

    // 1. Validate fields
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and slug are required",
        },
        { status: 400 },
      );
    }

    // 2. Normalize slug
    const normalizedSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    // 3. Check existing slug
    const existingPage = await prisma.page.findUnique({
      where: {
        slug: normalizedSlug,
      },
      select: {
        id: true,
      },
    });

    if (existingPage) {
      return NextResponse.json(
        {
          success: false,
          message: "This slug already exists",
        },
        { status: 409 },
      );
    }

    // 4. Create page
    const page = await prisma.page.create({
      data: {
        title: title.trim(),
        slug: normalizedSlug,
        content: {
          content: [],
          root: {
            props: {},
          },
        },
        status: "DRAFT",
      },
    });

    // 5. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Page created successfully",
        data: page,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Page creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create page",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Fetch single page by slug
    if (slug) {
      const page = await prisma.page.findUnique({
        where: { slug: slug.trim().toLowerCase() },
      });

      if (!page) {
        return NextResponse.json(
          { success: false, message: "Page not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Page fetched successfully",
          data: page,
        },
        { status: 200 },
      );
    }

    // Fetch all pages
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pages fetched successfully",
        data: pages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Pages fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
