"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Puck } from "@puckeditor/core";
import type { ComponentProps } from "react";
import toast from "react-hot-toast";

import { config } from "./config";

type PuckData = Parameters<
  NonNullable<ComponentProps<typeof Puck>["onPublish"]>
>[0];

type Page = {
  id: string;
  title: string;
  slug: string;
  content: PuckData;
  status: "DRAFT" | "PUBLISHED";
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type EditorProps = {
  pageId: string;
};

export default function PageEditor({ pageId }: EditorProps) {
  // Fetch page data
  const {
    data: page,
    isPending,
    error,
  } = useQuery({
    queryKey: ["page", pageId],

    queryFn: async (): Promise<Page> => {
      const response = await fetch(`/api/pages/${pageId}`, {
        cache: "no-store",
      });

      const result: ApiResponse<Page> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch page");
      }

      return result.data;
    },

    enabled: Boolean(pageId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Save Puck content
  const saveMutation = useMutation({
    mutationFn: async (content: PuckData) => {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const result: ApiResponse<Page> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save page");
      }

      return result.data;
    },

    onSuccess: () => {
      toast.success("Page saved successfully!");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to save page!");
    },
  });

  // Loading state
  if (isPending) {
    return <p className="p-6">Loading editor...</p>;
  }

  // Error state
  if (error) {
    return <p className="p-6 text-red-600">{error.message}</p>;
  }

  // Empty state
  if (!page) {
    return <p className="p-6">Page not found.</p>;
  }

  // Puck editor
  return (
    <div className="relative">
      {saveMutation.isPending && (
        <div className="fixed left-1/2 top-5 z-50 rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-lg">
          Saving...
        </div>
      )}

      <Puck
        config={config}
        data={page.content}
        onPublish={saveMutation.mutateAsync}
      />
    </div>
  );
}
