"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ImagePlus,
  Images,
  LayoutGrid,
  List,
  Loader2,
  Maximize2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  bulkDeleteGalleryImages,
  deleteGalleryImage,
  getGallery,
  uploadGalleryImage,
} from "@/services/gallery.service";
import type { Gallery } from "@prisma/client";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { GalleryPickerProps } from "./gallery-types";

const LIMIT = 20;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type ViewMode = "grid" | "list";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Format file size safely.
function formatFileSize(bytes?: number | null): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) {
    return "Unknown size";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Format image dimensions safely.
function formatDimensions(
  width?: number | null,
  height?: number | null,
): string {
  if (width == null || height == null || width <= 0 || height <= 0) {
    return "Unknown dimensions";
  }

  return `${width} × ${height}`;
}

// Format image format safely.
function getImageFormat(format?: string | null): string {
  return format?.toUpperCase() || "Unknown format";
}

export function GalleryPicker({
  open,
  onOpenChange,
  mode = "single",
  selectedImages,
  onSelect,
  maxSelection = 10,
}: GalleryPickerProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gallery filters.
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [view, setView] = useState<ViewMode>("grid");

  // Image preview.
  const [preview, setPreview] = useState<Gallery | null>(null);

  // Subject selection.
  // Used only for selecting images for the actual component/field.
  const [selected, setSelected] = useState<Record<string, Gallery>>(() =>
    Object.fromEntries(
      (selectedImages ?? []).map((image) => [image.id, image]),
    ),
  );

  // Gallery deletion selection.
  // Completely independent of subject selection.
  const [deleteSelected, setDeleteSelected] = useState<Record<string, Gallery>>(
    {},
  );

  // Debounced search.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch gallery.
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["gallery", { page, search, category }],
    queryFn: () =>
      getGallery({
        page,
        limit: LIMIT,
        search,
        category: category.trim(),
      }),
    enabled: open,
    placeholderData: (previousData) => previousData,
  });

  const images = data?.data ?? [];
  const pagination = data?.pagination;

  // Subject selection.
  const selectedList = useMemo(() => Object.values(selected), [selected]);

  const selectedCount = selectedList.length;

  // Delete selection.
  const deleteSelectedList = useMemo(
    () => Object.values(deleteSelected),
    [deleteSelected],
  );

  const deleteSelectedCount = deleteSelectedList.length;

  // Select all applies only to deletion.
  const allSelectedForDelete =
    images.length > 0 &&
    images.every((image) => Boolean(deleteSelected[image.id]));

  // Upload mutation.
  const uploadMutation = useMutation({
    mutationFn: uploadGalleryImage,

    onSuccess: async () => {
      toast.success("Image uploaded successfully");

      setPage(1);

      await queryClient.invalidateQueries({
        queryKey: ["gallery"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Image upload failed");
    },
  });

  // Delete one image.
  const deleteMutation = useMutation({
    mutationFn: deleteGalleryImage,

    onSuccess: async (_, id) => {
      toast.success("Image deleted successfully");

      setSelected((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });

      setDeleteSelected((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });

      setPreview((previous) => (previous?.id === id ? null : previous));

      await queryClient.invalidateQueries({
        queryKey: ["gallery"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Delete failed");
    },
  });

  // Bulk delete.
  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteGalleryImages,

    onSuccess: async (result) => {
      toast.success(`${result.deletedCount} image(s) deleted`);

      if (result.failedCleanupIds?.length > 0) {
        toast.error(
          `${result.failedCleanupIds.length} Cloudinary cleanup(s) failed`,
        );
      }

      // Remove successfully deleted IDs from both states.
      const deletedIds = new Set(deleteSelectedList.map((image) => image.id));

      setSelected((previous) => {
        const next = { ...previous };

        deletedIds.forEach((id) => {
          delete next[id];
        });

        return next;
      });

      setDeleteSelected({});

      setPreview((previous) =>
        previous && deletedIds.has(previous.id) ? null : previous,
      );

      await queryClient.invalidateQueries({
        queryKey: ["gallery"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Bulk delete failed");
    },
  });

  const isBusy =
    uploadMutation.isPending ||
    deleteMutation.isPending ||
    bulkDeleteMutation.isPending;

  // ==========================================
  // SUBJECT IMAGE SELECTION
  // ==========================================

  const toggleSubjectSelection = (image: Gallery) => {
    setSelected((previous) => {
      const exists = Boolean(previous[image.id]);

      if (exists) {
        const next = { ...previous };
        delete next[image.id];
        return next;
      }

      // Single image selection.
      if (mode === "single") {
        return {
          [image.id]: image,
        };
      }

      // Multiple image selection.
      if (Object.keys(previous).length >= maxSelection) {
        toast.error(`You can select a maximum of ${maxSelection} images`);

        return previous;
      }

      return {
        ...previous,
        [image.id]: image,
      };
    });
  };

  // GALLERY DELETE SELECTION
  const toggleDeleteSelection = (image: Gallery) => {
    setDeleteSelected((previous) => {
      const next = { ...previous };

      if (next[image.id]) {
        delete next[image.id];
      } else {
        next[image.id] = image;
      }

      return next;
    });
  };

  // Select/deselect all images on current page for deletion.
  const toggleSelectAllForDelete = (checked: boolean) => {
    if (!checked) {
      setDeleteSelected((previous) => {
        const next = { ...previous };

        images.forEach((image) => {
          delete next[image.id];
        });

        return next;
      });

      return;
    }

    setDeleteSelected((previous) => {
      const next = { ...previous };

      images.forEach((image) => {
        next[image.id] = image;
      });

      return next;
    });
  };

  // Clear deletion selection.
  const clearDeleteSelection = () => {
    setDeleteSelected({});
  };

  // UPLOAD
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG and WEBP images are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Maximum image size is 5 MB");
      event.target.value = "";
      return;
    }

    uploadMutation.mutate({
      image: file,
      title: file.name.replace(/\.[^/.]+$/, ""),
    });

    event.target.value = "";
  };

  // DELETE
  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this image?",
    );

    if (!confirmed) return;

    deleteMutation.mutate(id);
  };

  const handleBulkDelete = () => {
    const ids = deleteSelectedList.map((image) => image.id);

    if (ids.length === 0) {
      toast.error("Please select images to delete");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${ids.length} selected image(s)?`,
    );

    if (!confirmed) return;

    bulkDeleteMutation.mutate(ids);
  };

  // CONFIRM SUBJECT SELECTION
  const handleConfirm = () => {
    if (selectedCount === 0) {
      toast.error("Please select at least one image");
      return;
    }

    onSelect(selectedList);
    onOpenChange(false);
  };

  return (
    <>
      {/* ===================================== */}
      {/* MEDIA LIBRARY */}
      {/* ===================================== */}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex h-[90vh] max-w-6xl! flex-col gap-0 overflow-hidden p-0">
          {/* Header */}
          <DialogHeader className="shrink-0 border-b px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Images className="size-5 text-primary" />
                  Media Library
                </DialogTitle>

                <DialogDescription className="mt-1">
                  Browse, upload and manage your images.
                </DialogDescription>
              </div>

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="shrink-0"
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Upload
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
          </DialogHeader>

          {/* Toolbar */}
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b px-5 py-4 sm:px-6">
            <div className="relative min-w-45 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search images..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-9 pl-9"
              />
            </div>

            <Input
              placeholder="Filter category..."
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              className="h-9 w-full sm:w-44"
            />

            <div className="flex shrink-0 items-center rounded-lg border p-1">
              <Button
                type="button"
                size="icon"
                variant={view === "grid" ? "secondary" : "ghost"}
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className="size-8"
              >
                <LayoutGrid className="size-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={view === "list" ? "secondary" : "ghost"}
                onClick={() => setView("list")}
                aria-label="List view"
                className="size-8"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>

          {/* ===================================== */}
          {/* GALLERY MANAGEMENT TOOLBAR */}
          {/* ===================================== */}

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={
                  allSelectedForDelete
                    ? true
                    : deleteSelectedCount > 0
                      ? undefined
                      : false
                }
                onCheckedChange={(checked) =>
                  toggleSelectAllForDelete(checked === true)
                }
                aria-label="Select all images for deletion"
              />

              <div className="text-sm">
                <span className="font-semibold tabular-nums">
                  {deleteSelectedCount}
                </span>{" "}
                <span className="text-muted-foreground">
                  selected for deletion
                </span>
              </div>
            </div>

            {deleteSelectedCount > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={clearDeleteSelection}
                  disabled={isBusy}
                >
                  <X className="size-4" />
                  Clear
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={isBusy}
                >
                  {bulkDeleteMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Delete selected ({deleteSelectedCount})
                </Button>
              </div>
            )}
          </div>

          {/* ===================================== */}
          {/* GALLERY CONTENT */}
          {/* ===================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {isPending ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 animate-spin text-primary" />

                <p className="text-sm text-muted-foreground">
                  Loading your media library...
                </p>
              </div>
            ) : images.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                  <ImagePlus className="size-8 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold">No images found</h3>

                  <p className="max-w-xs text-sm text-muted-foreground">
                    {search || category
                      ? "Try changing your search or category filter."
                      : "Your media library is empty. Upload your first image to get started."}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                >
                  <Upload className="size-4" />
                  Upload image
                </Button>
              </div>
            ) : (
              <>
                {isFetching && (
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-3 animate-spin" />
                    Updating gallery...
                  </div>
                )}

                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
                      : "flex flex-col gap-2"
                  }
                >
                  {images.map((image) => {
                    const isSubjectSelected = Boolean(selected[image.id]);

                    const isDeleteSelected = Boolean(deleteSelected[image.id]);

                    return (
                      <div
                        key={image.id}
                        className={`group relative overflow-hidden rounded-xl border bg-card transition-all duration-200 ${
                          isSubjectSelected
                            ? "border-primary ring-2 ring-primary/20"
                            : "hover:border-primary/50 hover:shadow-sm"
                        } ${
                          view === "list"
                            ? "flex items-center gap-3 p-2 sm:gap-4"
                            : ""
                        }`}
                      >
                        {/* Thumbnail */}
                        <div
                          className={
                            view === "grid"
                              ? "relative aspect-square cursor-pointer overflow-hidden bg-muted"
                              : "relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-muted sm:size-20"
                          }
                          onClick={() => toggleSubjectSelection(image)}
                        >
                          <Image
                            src={image.imageUrl}
                            alt={
                              image.altText || image.title || "Gallery image"
                            }
                            fill
                            sizes={
                              view === "grid"
                                ? "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                : "80px"
                            }
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />

                          {/* Subject selection overlay */}
                          {isSubjectSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/25">
                              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                                <Check className="size-5" />
                              </div>
                            </div>
                          )}

                          {/* Delete selection checkbox */}
                          <div
                            className="absolute left-2 top-2 z-10"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Checkbox
                              checked={isDeleteSelected}
                              onCheckedChange={() =>
                                toggleDeleteSelection(image)
                              }
                              aria-label={`Select ${image.title || "image"} for deletion`}
                              className="border-white bg-background shadow-sm"
                            />
                          </div>

                          {/* Preview button */}
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-2 right-2 z-10 size-8 opacity-100 shadow-sm sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              setPreview(image);
                            }}
                            aria-label="Preview image"
                          >
                            <Maximize2 className="size-4" />
                          </Button>
                        </div>

                        {/* Image details */}
                        <div
                          className={
                            view === "grid"
                              ? "min-w-0 space-y-1.5 p-3"
                              : "min-w-0 flex-1 space-y-1"
                          }
                        >
                          <p
                            className="truncate text-sm font-medium"
                            title={image.publicId || "Untitled"}
                          >
                            {image.publicId || "Untitled"}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {getImageFormat(image.format)} ·{" "}
                            {formatFileSize(image.bytes)}
                          </p>

                          {image.category && (
                            <p className="truncate text-xs text-muted-foreground">
                              {image.category}
                            </p>
                          )}

                          {view === "list" && (
                            <p className="text-xs text-muted-foreground">
                              {formatDimensions(image.width, image.height)}
                            </p>
                          )}

                          {isSubjectSelected && (
                            <p className="text-xs font-medium text-primary">
                              Selected for use
                            </p>
                          )}

                          {isDeleteSelected && (
                            <p className="text-xs font-medium text-destructive">
                              Selected for deletion
                            </p>
                          )}
                        </div>

                        {/* Individual delete */}
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className={
                            view === "grid"
                              ? "absolute right-2 top-2 z-10 size-8 bg-background/90 text-destructive shadow-sm hover:bg-destructive hover:text-white"
                              : "mr-1 size-8 shrink-0 text-destructive hover:bg-destructive hover:text-white"
                          }
                          onClick={() => handleDelete(image.id)}
                          disabled={isBusy}
                          aria-label="Delete image"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* ===================================== */}
          {/* FOOTER */}
          {/* ===================================== */}

          <DialogFooter className="flex-row shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-5 py-4 sm:px-6 m-0">
            <div className="gap-3 text-sm flex items-center">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {pagination?.total ?? 0}
                </span>{" "}
                images
              </p>

              {pagination && (
                <p className="text-xs text-muted-foreground">
                  Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!pagination?.hasPrevPage || isFetching}
                onClick={() => setPage((previous) => previous - 1)}
              >
                Previous
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!pagination?.hasNextPage || isFetching}
                onClick={() => setPage((previous) => previous + 1)}
              >
                Next
              </Button>

              <Button
                type="button"
                onClick={handleConfirm}
                disabled={selectedCount === 0 || isBusy}
                className="min-w-24"
              >
                <Check className="size-4" />
                Select
                {selectedCount > 0 && ` (${selectedCount})`}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================================== */}
      {/* IMAGE PREVIEW */}
      {/* ===================================== */}

      <Dialog
        open={Boolean(preview)}
        onOpenChange={(value) => {
          if (!value) setPreview(null);
        }}
      >
        <DialogContent className="max-w-3xl overflow-hidden">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="truncate">
                  {preview.publicId || "Untitled image"}
                </DialogTitle>

                <DialogDescription>
                  {formatDimensions(preview.width, preview.height)} ·{" "}
                  {getImageFormat(preview.format)}
                </DialogDescription>
              </DialogHeader>

              {/* Preview image */}
              <div className="relative flex h-[54vh] max-h-100 min-h-48 items-center justify-center overflow-hidden rounded-xl bg-muted">
                <Image
                  src={preview.imageUrl}
                  alt={preview.altText || preview.title || "Gallery image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              </div>

              {/* Image metadata */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 text-sm sm:grid-cols-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-muted-foreground">File size</p>

                  <p className="truncate font-medium">
                    {formatFileSize(preview.bytes)}
                  </p>
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-muted-foreground">Dimensions</p>

                  <p className="truncate font-medium">
                    {formatDimensions(preview.width, preview.height)}
                  </p>
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-muted-foreground">Category</p>

                  <p className="truncate font-medium">
                    {preview.category || "Uncategorized"}
                  </p>
                </div>

                <div className="col-span-2 min-w-0 space-y-1 sm:col-span-3">
                  <p className="text-xs text-muted-foreground">Alt text</p>

                  <p className="wrap-break-word font-medium">
                    {preview.altText || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Preview delete action */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => handleDelete(preview.id)}
                >
                  <Trash2 className="size-4" />
                  Delete image
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
