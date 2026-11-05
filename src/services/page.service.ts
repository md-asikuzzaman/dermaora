import { Page, PageResponse } from "@/types/puck.type";

/** Get page by slug */
export async function getPublishedPageBySlug(
  slug: string,
): Promise<Page | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error("URL is not configured");
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

/** Get all pages */
export async function getPages(): Promise<Page[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error("URL is not configured");
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

/** Create a new page */
export async function createPage(page: Partial<Page>): Promise<Page> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error("APP_URL is not configured");
  }

  const response = await fetch(`/api/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(page),
  });

  if (!response.ok) {
    throw new Error("Failed to create page");
  }

  const result: PageResponse<Page> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to create page");
  }

  return result.data;
}

/** Update an existing page */
export async function updatePage(
  pageId: string,
  page: Partial<Page>,
): Promise<Page> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error("APP_URL is not configured");
  }

  const response = await fetch(`/api/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(page),
  });

  if (!response.ok) {
    throw new Error("Failed to update page");
  }

  const result: PageResponse<Page> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to update page");
  }

  return result.data;
}

/** Delete a page */
export async function deletePage(pageId: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error("APP_URL is not configured");
  }

  const response = await fetch(`/api/pages/${pageId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete page");
  }

  const result: PageResponse<null> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to delete page");
  }
}
