"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, LoaderCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductToolbarProps {
  total: number;
  isFetching: boolean;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A to Z" },
];

export default function ProductToolbar({
  total,
  isFetching,
}: ProductToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";

  const selectedSort =
    sortOptions.find((option) => option.value === currentSort) ??
    sortOptions[0];

  const handleSortChange = (value: string | null) => {
    if (!value) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);
    params.set("page", "1");

    router.replace(`/products?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 border-b pb-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{total}</span>{" "}
          products found
        </p>

        {isFetching && (
          <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          Sort by:
        </span>

        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <ArrowDownUp className="size-4" />

            <SelectValue>{selectedSort.label}</SelectValue>
          </SelectTrigger>

          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
