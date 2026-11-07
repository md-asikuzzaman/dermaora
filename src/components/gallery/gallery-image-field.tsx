"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GalleryPicker } from "./gallery-picker";

import type { Gallery } from "@prisma/client";
import type { GalleryImageFieldProps } from "./gallery-types";

export function GalleryImageField(props: GalleryImageFieldProps) {
  const [open, setOpen] = useState(false);

  const selectedImages =
    props.mode === "single" ? (props.value ? [props.value] : []) : props.value;

  const handleSelect = (images: Gallery[]) => {
    if (props.mode === "single") {
      props.onChange(images[0]?.imageUrl ?? null);
    } else {
      props.onChange(images.map((image) => image.imageUrl));
    }

    setOpen(false);
  };

  const handleRemove = (url: string) => {
    if (props.mode === "single") {
      props.onChange(null);
    } else {
      props.onChange(props.value.filter((image) => image !== url));
    }
  };

  const maxSelection =
    props.mode === "multiple" ? (props.maxSelection ?? 5) : 1;

  const canAddMore =
    props.mode === "single"
      ? selectedImages.length === 0
      : selectedImages.length < maxSelection;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{props.label ?? "Images"}</p>

        {props.mode === "multiple" && (
          <span className="text-xs text-muted-foreground">
            {selectedImages.length}/{maxSelection}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {selectedImages.map((url) => (
          <div
            key={url}
            onClick={() => {
              if (props.isEdit && !props.disabled) {
                setOpen(true);
              }
            }}
            className={`group relative size-24 overflow-hidden rounded-lg border bg-muted ${
              props.isEdit ? "cursor-pointer" : ""
            }`}
          >
            <Image
              src={url}
              alt="Selected image"
              fill
              sizes="96px"
              className="object-contain"
            />

            {props.isEdit && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <ImagePlus className="size-6 text-white" />
              </div>
            )}

            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute right-1 top-1 size-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(url);
              }}
              disabled={props.disabled}
              aria-label="Remove image"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={props.disabled}
            className="flex size-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
          >
            <ImagePlus className="size-6" />
            <span className="text-xs">
              {selectedImages.length ? "Add more" : "Choose image"}
            </span>
          </button>
        )}
      </div>

      <GalleryPicker
        open={open}
        onOpenChange={setOpen}
        mode={props.mode}
        selectedImages={[]}
        onSelect={handleSelect}
        maxSelection={maxSelection}
      />
    </div>
  );
}
