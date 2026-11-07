import type { Gallery } from "@prisma/client";

export type GalleryMode = "single" | "multiple";

export type GalleryPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode?: GalleryMode;

  selectedImages?: Gallery[];

  onSelect: (images: Gallery[]) => void;

  maxSelection?: number;
};
