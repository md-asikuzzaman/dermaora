import type { Gallery } from "@prisma/client";

interface GalleryImageFieldBaseProps {
  label?: string;
  disabled?: boolean;
  isEdit?: boolean;
}

export type GalleryImageFieldProps =
  | (GalleryImageFieldBaseProps & {
      mode: "single";
      value: string | null;
      onChange: (value: string | null) => void;
    })
  | (GalleryImageFieldBaseProps & {
      mode: "multiple";
      value: string[];
      onChange: (value: string[]) => void;
      maxSelection?: number;
    });

export interface GalleryPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "single" | "multiple";
  selectedImages: Gallery[];
  onSelect: (images: Gallery[]) => void;
  maxSelection?: number;
}
