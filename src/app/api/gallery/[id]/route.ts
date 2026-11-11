import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { isValidObjectId } from "@/lib/isObjectId";
import { gallerySchema } from "@/schema/gallery.schema";
import { deleteImage, uploadImage } from "@/services/cloudinary.service";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    // 1. Get ID from params
    const { id } = await params;

    // 2. Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery ID",
        },
        { status: 400 },
      );
    }

    // 3. Find gallery
    const gallery = await prisma.gallery.findUnique({
      where: { id },
    });

    // 4. Check existence
    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery image not found",
        },
        { status: 404 },
      );
    }

    // 5. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Gallery fetched successfully",
        data: gallery,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Gallery fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  let uploadedPublicId: string | undefined;

  try {
    const { id } = await params;

    // 1. Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid gallery ID" },
        { status: 400 },
      );
    }

    // 2. Find existing gallery
    const existingGallery = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existingGallery) {
      return NextResponse.json(
        { success: false, message: "Gallery image not found" },
        { status: 404 },
      );
    }

    // 3. Get form data
    const formData = await request.formData();
    const image = formData.get("image");

    // 4. Validate text fields
    const getText = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() || undefined : undefined;
    };

    const validation = gallerySchema.safeParse({
      title: getText("title"),
      description: getText("description"),
      category: getText("category"),
      altText: getText("altText"),
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // 5. Validate optional image
    if (image !== null) {
      if (!(image instanceof File)) {
        return NextResponse.json(
          { success: false, message: "Invalid image file" },
          { status: 400 },
        );
      }

      if (!ALLOWED_TYPES.includes(image.type)) {
        return NextResponse.json(
          {
            success: false,
            message: "Only JPEG, PNG and WEBP images are allowed",
          },
          { status: 400 },
        );
      }

      if (image.size === 0 || image.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "Image must be between 1 byte and 5 MB",
          },
          { status: 400 },
        );
      }
    }

    // 6. Prepare update data
    const updateData = {
      ...validation.data,
    };

    let oldPublicId: string | undefined;

    // 7. Upload new image if provided
    if (image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const uploadedImage = await uploadImage(buffer);

      uploadedPublicId = uploadedImage.public_id;
      oldPublicId = existingGallery.publicId;

      Object.assign(updateData, {
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        width: uploadedImage.width,
        height: uploadedImage.height,
        format: uploadedImage.format,
        bytes: uploadedImage.bytes,
      });
    }

    try {
      // 8. Update MongoDB
      const updatedGallery = await prisma.gallery.update({
        where: { id },
        data: updateData,
      });

      // 9. Delete old image after successful DB update
      if (oldPublicId) {
        try {
          const result = await deleteImage(oldPublicId);

          if (result.result !== "ok" && result.result !== "not found") {
            console.error("Old Cloudinary image was not deleted:", result);
          }
        } catch (cleanupError) {
          console.error("Old image cleanup failed:", cleanupError);
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: "Gallery updated successfully",
          data: updatedGallery,
        },
        { status: 200 },
      );
    } catch (dbError) {
      // 10. Rollback new Cloudinary upload if DB update fails
      if (uploadedPublicId) {
        try {
          await deleteImage(uploadedPublicId);
        } catch (cleanupError) {
          console.error("New image cleanup failed:", cleanupError);
        }
      }

      throw dbError;
    }
  } catch (error) {
    console.error("Gallery update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update gallery",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    // 1. Get ID
    const { id } = await params;

    // 2. Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery ID",
        },
        { status: 400 },
      );
    }

    // 3. Find existing gallery
    const existingGallery = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existingGallery) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery image not found",
        },
        { status: 404 },
      );
    }

    // 4. Delete from MongoDB first
    await prisma.gallery.delete({
      where: { id },
    });

    // 5. Delete image from Cloudinary
    try {
      const result = await deleteImage(existingGallery.publicId);

      if (result.result !== "ok" && result.result !== "not found") {
        console.error("Cloudinary image deletion failed:", result);

        return NextResponse.json(
          {
            success: true,
            message:
              "Gallery deleted, but Cloudinary image cleanup needs retry",
          },
          { status: 200 },
        );
      }
    } catch (cleanupError) {
      console.error("Cloudinary deletion error:", cleanupError);

      return NextResponse.json(
        {
          success: true,
          message: "Gallery deleted, but Cloudinary image cleanup failed",
        },
        { status: 200 },
      );
    }

    // 6. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Gallery deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Gallery deletion error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete gallery",
      },
      { status: 500 },
    );
  }
}
