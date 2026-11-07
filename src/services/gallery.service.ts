import type { Gallery } from "@prisma/client";

import { getBaseUrl, handleResponse } from "./api-utils";

export type GalleryQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

export type GalleryUploadInput = {
  image: File;
  title?: string;
  description?: string;
  category?: string;
  altText?: string;
};

export type GalleryUpdateInput = {
  image?: File;
  title?: string;
  description?: string;
  category?: string;
  altText?: string;
};

export type BulkDeleteGalleryResponse = {
  deletedCount: number;
  failedCleanupIds: string[];
  notFoundIds: string[];
};

/** Get all gallery images with pagination and filters */
export type GalleryPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GalleryResponse = {
  data: Gallery[];
  pagination: GalleryPagination;
};

export async function getGallery(
  params: GalleryQueryParams = {},
): Promise<GalleryResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  const response = await fetch(
    `${getBaseUrl()}/api/gallery?${searchParams.toString()}`,
    {
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch gallery");
  }

  return {
    data: result.data,
    pagination: result.pagination,
  };
}
/** Get a single gallery image */
export async function getGalleryImage(id: string): Promise<Gallery> {
  const response = await fetch(
    `${getBaseUrl()}/api/gallery/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );

  return handleResponse<Gallery>(response);
}

/** Upload a gallery image */
export async function uploadGalleryImage(
  data: GalleryUploadInput,
): Promise<Gallery> {
  const formData = new FormData();

  formData.append("image", data.image);

  if (data.title) formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.category) formData.append("category", data.category);
  if (data.altText) formData.append("altText", data.altText);

  const response = await fetch(`${getBaseUrl()}/api/gallery`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<Gallery>(response);
}

/** Update a gallery image */
export async function updateGalleryImage(
  id: string,
  data: GalleryUpdateInput,
): Promise<Gallery> {
  const formData = new FormData();

  if (data.image) formData.append("image", data.image);
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.category !== undefined) formData.append("category", data.category);
  if (data.altText !== undefined) formData.append("altText", data.altText);

  const response = await fetch(
    `${getBaseUrl()}/api/gallery/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: formData,
    },
  );

  return handleResponse<Gallery>(response);
}

/** Delete a single gallery image */
export async function deleteGalleryImage(id: string): Promise<void> {
  const response = await fetch(
    `${getBaseUrl()}/api/gallery/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  return handleResponse<void>(response);
}

/** Delete multiple gallery images */
export async function bulkDeleteGalleryImages(
  ids: string[],
): Promise<BulkDeleteGalleryResponse> {
  const response = await fetch(`${getBaseUrl()}/api/gallery/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  return handleResponse<BulkDeleteGalleryResponse>(response);
}
