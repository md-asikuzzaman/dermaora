import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidObjectId } from "@/lib/isObjectId";
import { requireAdmin } from "@/lib/requireAdmin";
import { updateCategorySchema } from "@/schema/category.schema";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 },
      );
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    // const unauthorized = await requireAdmin();
    // if (unauthorized) return unauthorized;

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const validation = updateCategorySchema.safeParse(body);

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

    const data = validation.data;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one field is required" },
        { status: 400 },
      );
    }

    // Check self-parent
    if (data.parentId === id) {
      return NextResponse.json(
        {
          success: false,
          message: "A category cannot be its own parent",
        },
        { status: 400 },
      );
    }

    // Check parent category
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
        select: { id: true },
      });

      if (!parent) {
        return NextResponse.json(
          { success: false, message: "Parent category not found" },
          { status: 404 },
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "Category slug already exists" },
        { status: 409 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 },
    );
  }
}
export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    // const unauthorized = await requireAdmin();
    // if (unauthorized) return unauthorized;

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 },
      );
    }

    const [products, children] = await Promise.all([
      prisma.product.count({ where: { categoryId: id } }),
      prisma.category.count({ where: { parentId: id } }),
    ]);

    if (products > 0 || children > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete category because it has products or child categories",
        },
        { status: 409 },
      );
    }

    const category = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    console.error("Delete category error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 },
    );
  }
}
