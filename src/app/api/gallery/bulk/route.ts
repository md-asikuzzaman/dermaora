import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { deleteImage } from "@/services/cloudinary.service";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

const MAX_BULK_DELETE = 50;

export async function DELETE(request: Request) {
  try {
    // 1. Get request body
    let body: { ids?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        { status: 400 },
      );
    }

    const { ids } = body;

    // 2. Validate IDs array
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => typeof id === "string")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid array of IDs",
        },
        { status: 400 },
      );
    }

    // 3. Remove duplicate IDs
    const uniqueIds = [...new Set(ids)];

    // 4. Limit bulk delete
    if (uniqueIds.length > MAX_BULK_DELETE) {
      return NextResponse.json(
        {
          success: false,
          message: `You can delete maximum ${MAX_BULK_DELETE} images at once`,
        },
        { status: 400 },
      );
    }

    // 5. Validate MongoDB ObjectIds
    if (!uniqueIds.every(isValidObjectId)) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more IDs are invalid",
        },
        { status: 400 },
      );
    }

    // 6. Find existing gallery records
    const galleryItems = await prisma.gallery.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
      },
      select: {
        id: true,
        publicId: true,
      },
    });

    if (galleryItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No gallery images found",
        },
        { status: 404 },
      );
    }

    // 7. Delete records from MongoDB
    const dbResult = await prisma.gallery.deleteMany({
      where: {
        id: {
          in: galleryItems.map((item) => item.id),
        },
      },
    });

    // 8. Delete images from Cloudinary
    const cleanupResults = await Promise.allSettled(
      galleryItems.map(async (item) => {
        const result = await deleteImage(item.publicId);

        if (result.result !== "ok" && result.result !== "not found") {
          throw new Error(
            `Failed to delete Cloudinary image: ${item.publicId}`,
          );
        }

        return item.id;
      }),
    );

    // 9. Collect failed Cloudinary deletions
    const failedCleanupIds = cleanupResults.flatMap((result, index) =>
      result.status === "rejected" ? [galleryItems[index].id] : [],
    );

    // 10. Find IDs not present in database
    const foundIds = new Set(galleryItems.map((item) => item.id));

    const notFoundIds = uniqueIds.filter((id) => !foundIds.has(id));

    // 11. Success response
    return NextResponse.json(
      {
        success: true,
        message:
          failedCleanupIds.length > 0
            ? "Gallery records deleted, but some Cloudinary images need cleanup"
            : "Gallery images deleted successfully",

        data: {
          deletedCount: dbResult.count,
          failedCleanupIds,
          notFoundIds,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Bulk gallery deletion error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete gallery images",
      },
      { status: 500 },
    );
  }
}
