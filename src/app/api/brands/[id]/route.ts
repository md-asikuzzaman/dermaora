import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidObjectId } from "@/lib/isObjectId";
import { requireAdmin } from "@/lib/requireAdmin";
import { updateBrandSchema } from "@/schema/brand.schema";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid brand ID" },
        { status: 400 },
      );
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Brand fetched successfully",
      data: brand,
    });
  } catch (error) {
    console.error("Get brand error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch brand" },
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
        { success: false, message: "Invalid brand ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const validation = updateBrandSchema.safeParse(body);

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

    const brand = await prisma.brand.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  } catch (error) {
    console.error("Update brand error:", error);

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

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update brand" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    // const session = await auth();

    // if (session?.user?.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: 401 },
    //   );
    // }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid brand ID" },
        { status: 400 },
      );
    }

    const products = await prisma.product.count({
      where: { brandId: id },
    });

    if (products > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete brand because it has products",
        },
        { status: 409 },
      );
    }

    const brand = await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
      data: brand,
    });
  } catch (error) {
    console.error("Delete brand error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete brand" },
      { status: 500 },
    );
  }
}
