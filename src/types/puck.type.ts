export interface Page {
  id: string;
  title: string;
  slug: string;
  content: {
    content: Array<{
      type: string;
      props: Record<string, unknown>;
    }>;
  };
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
}
export interface PageResponse<T = Page> {
  success: boolean;
  message: string;
  data: T;
}
