"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Blocks, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deletePage, updatePage } from "@/services/page.service";

type PageActionsProps = {
  page: {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED";
  };
};

export function PageActions({ page }: PageActionsProps) {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState(page.status);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    try {
      setIsLoading(true);

      await updatePage(page.id, {
        title: title.trim(),
        slug: slug.trim(),
        status,
      });

      toast.success("Page updated successfully");

      setEditOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update page",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deletePage(page.id);

      toast.success("Page deleted successfully");

      setDeleteOpen(false);
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete page",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Page Builder */}
      <Button
        variant="outline"
        size="icon"
        aria-label="Open page builder"
        render={
          <Link
            href={`/admin/editor/${page.id}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <Blocks className="size-4" />
      </Button>

      {/* Edit Page */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (open) {
            setTitle(page.title);
            setSlug(page.slug);
            setStatus(page.status);
          }
        }}
      >
        <DialogTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Edit page">
              <Pencil className="size-4" />
            </Button>
          }
        />

        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Page</DialogTitle>
              <DialogDescription>
                Update your page information.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-5">
              <div className="grid gap-2">
                <Label htmlFor={`title-${page.id}`}>Page Title</Label>

                <Input
                  id={`title-${page.id}`}
                  placeholder="About Us"
                  value={title}
                  onChange={(event) => {
                    const value = event.target.value;

                    setTitle(value);
                    setSlug(
                      value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    );
                  }}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`slug-${page.id}`}>Page Slug</Label>

                <Input
                  id={`slug-${page.id}`}
                  placeholder="about-us"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  disabled={isLoading}
                />

                <p className="text-xs text-muted-foreground">
                  Your page URL: /{slug || "your-page"}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>

                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as "DRAFT" | "PUBLISHED")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Page */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="destructive"
              size="icon"
              aria-label="Delete page"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          }
        />

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this page?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {page.title}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
