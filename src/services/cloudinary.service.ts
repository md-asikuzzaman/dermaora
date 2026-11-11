import { randomUUID } from "node:crypto";
import cloudinary from "@/lib/cloudinary";

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || "gallery";

export function uploadImage(buffer: Buffer): Promise<{
  secure_url: string;
  public_id: string;
  asset_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}> {
  return new Promise((resolve, reject) => {
    const publicId = `gallery-${randomUUID()}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          asset_id: result.asset_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
}
