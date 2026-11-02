import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { isValidObjectId } from "@/lib/isObjectId";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/pages/[id]
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid page ID" },
        { status: 400 },
      );
    }

    const page = await prisma.page.findUnique({
      where: { id },
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
  } catch (error) {
    console.error("Page fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch page" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid page ID" },
        { status: 400 },
      );
    }

    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json(
        { success: false, message: "Page not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const updateData: Prisma.PageUpdateInput = {};

    // Title update
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return NextResponse.json(
          { success: false, message: "Title must be a non-empty string" },
          { status: 400 },
        );
      }

      updateData.title = body.title.trim();
    }

    // Slug update
    if (body.slug !== undefined) {
      if (typeof body.slug !== "string" || !body.slug.trim()) {
        return NextResponse.json(
          { success: false, message: "Slug must be a non-empty string" },
          { status: 400 },
        );
      }

      const normalizedSlug = body.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      const duplicatePage = await prisma.page.findUnique({
        where: { slug: normalizedSlug },
        select: { id: true },
      });

      if (duplicatePage && duplicatePage.id !== id) {
        return NextResponse.json(
          { success: false, message: "This slug already exists" },
          { status: 409 },
        );
      }

      updateData.slug = normalizedSlug;
    }

    // Puck content update
    if (body.content !== undefined) {
      if (
        typeof body.content !== "object" ||
        body.content === null ||
        Array.isArray(body.content) ||
        !Array.isArray(body.content.content) ||
        typeof body.content.root !== "object" ||
        body.content.root === null ||
        Array.isArray(body.content.root)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid Puck content format" },
          { status: 400 },
        );
      }

      updateData.content = body.content as Prisma.InputJsonValue;
    }

    // Status update
    if (body.status !== undefined) {
      if (!["DRAFT", "PUBLISHED"].includes(body.status)) {
        return NextResponse.json(
          { success: false, message: "Status must be DRAFT or PUBLISHED" },
          { status: 400 },
        );
      }

      updateData.status = body.status;

      updateData.publishedAt =
        body.status === "PUBLISHED"
          ? (existingPage.publishedAt ?? new Date())
          : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update" },
        { status: 400 },
      );
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Page updated successfully",
        data: updatedPage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Page update error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "This slug already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update page" },
      { status: 500 },
    );
  }
}

// DELETE /api/pages/[id]
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid page ID" },
        { status: 400 },
      );
    }

    const existingPage = await prisma.page.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true },
    });

    if (!existingPage) {
      return NextResponse.json(
        { success: false, message: "Page not found" },
        { status: 404 },
      );
    }

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Page deleted successfully",
        data: existingPage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Page deletion error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete page" },
      { status: 500 },
    );
  }
}
