import "server-only";

import { Page, PageResponse } from "@/types/puck.type";

export async function getPublishedPageBySlug(
  slug: string,
): Promise<Page | null> {
  const baseUrl = process.env.APP_URL;

  if (!baseUrl) {
    throw new Error("APP_URL is not configured");
  }

  const url = new URL(`/api/pages?slug=${encodeURIComponent(slug)}`, baseUrl);

  console.log(url);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch page");
  }

  const result: PageResponse<Page> = await response.json();

  if (!result.success || !result.data) {
    throw new Error("Invalid page response");
  }

  return result.data;
}

export async function getPages(): Promise<Page[]> {
  const baseUrl = process.env.APP_URL;

  if (!baseUrl) {
    throw new Error("APP_URL is not configured");
  }

  const response = await fetch(`${baseUrl}/api/pages`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pages");
  }

  const result: PageResponse<Page[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch pages");
  }

  return result.data;
}
