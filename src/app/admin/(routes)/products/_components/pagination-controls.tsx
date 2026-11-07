"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
};

export function PaginationControls({
  page,
  totalPages,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (pageNumber === 1) {
      params.delete("page");
    } else {
      params.set("page", String(pageNumber));
    }

    const query = params.toString();

    router.push(query ? `?${query}` : "?");
  };

  return (
    <Pagination className="mx-0 w-auto justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={page > 1 ? `?page=${page - 1}` : undefined}
            aria-disabled={page <= 1}
            onClick={(event) => {
              event.preventDefault();

              if (page > 1) {
                handlePageChange(page - 1);
              }
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href={`?page=${page}`} isActive aria-current="page">
            {page}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <span className="px-2 text-sm text-muted-foreground">
            of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href={page < totalPages ? `?page=${page + 1}` : undefined}
            aria-disabled={page >= totalPages}
            onClick={(event) => {
              event.preventDefault();

              if (page < totalPages) {
                handlePageChange(page + 1);
              }
            }}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
