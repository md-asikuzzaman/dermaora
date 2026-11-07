import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/services/cloudinary.service";
import { gallerySchema } from "@/schema/gallery.schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Handles the POST request to upload an image to the gallery.
 */
export async function POST(request: Request) {
  try {
    // 1. Get form data
    const formData = await request.formData();
    const image = formData.get("image");

    // 2. Validate image existence
    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Image is required",
        },
        { status: 400 },
      );
    }

    // 3. Validate image type
    if (!ALLOWED_TYPES.includes(image.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPEG, PNG and WEBP images are allowed",
        },
        { status: 400 },
      );
    }

    // 4. Validate image size
    if (image.size === 0 || image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be between 1 byte and 5 MB",
        },
        { status: 400 },
      );
    }

    // 5. Validate text fields
    const validation = gallerySchema.safeParse({
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      category: formData.get("category") || undefined,
      altText: formData.get("altText") || undefined,
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

    // 6. Convert image to Buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // 7. Upload image to Cloudinary
    const uploadedImage = await uploadImage(buffer);

    try {
      // 8. Save image metadata to MongoDB
      const gallery = await prisma.gallery.create({
        data: {
          title: validation.data.title,
          description: validation.data.description,
          category: validation.data.category,
          altText: validation.data.altText,

          imageUrl: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,

          width: uploadedImage.width,
          height: uploadedImage.height,
          format: uploadedImage.format,
          bytes: uploadedImage.bytes,
        },
      });

      // 9. Success response
      return NextResponse.json(
        {
          success: true,
          message: "Image uploaded successfully",
          data: gallery,
        },
        { status: 201 },
      );
    } catch (dbError) {
      // 10. Rollback Cloudinary upload if DB save fails
      try {
        await deleteImage(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed:", cleanupError);
      }

      throw dbError;
    }
  } catch (error) {
    console.error("Gallery upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload image",
      },
      { status: 500 },
    );
  }
}

/**
 * Handles the GET request to fetch gallery images with pagination and filtering.
 */

export async function GET(request: Request) {
  try {
    // 1. Get query parameters
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      20,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    // 2. Calculate pagination
    const skip = (page - 1) * limit;

    // 3. Build filter
    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          {
            description: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),

      ...(category && { category }),
    };

    // 4. Fetch gallery and total count
    const [gallery, total] = await prisma.$transaction([
      prisma.gallery.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.gallery.count({ where }),
    ]);

    // 5. Pagination metadata
    const totalPages = Math.ceil(total / limit);

    // 6. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Gallery fetched successfully",
        data: gallery,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
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
