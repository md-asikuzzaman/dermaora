import "server-only";

import { PageResponse } from "@/types/puck.type";

export async function getPublishedPageBySlug(
  slug: string,
): Promise<PageResponse["data"] | null> {
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

  const result: PageResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error("Invalid page response");
  }

  return result.data;
}
