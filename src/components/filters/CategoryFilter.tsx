"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/services/category.service";

interface CategoryFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function CategoryFilter({
  value,
  onChange,
}: CategoryFilterProps) {
  const [search, setSearch] = useState("");

  const {
    data: categories = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Search categories by name
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase().trim()),
    );
  }, [categories, search]);

  // Toggle selected category slug
  const toggleCategory = (slug: string) => {
    const updatedCategories = value.includes(slug)
      ? value.filter((item) => item !== slug)
      : [...value, slug];

    onChange(updatedCategories);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="pl-9"
        />
      </div>

      {/* Category List */}
      <div className="max-h-60 space-y-3 overflow-y-auto">
        {isPending && (
          <p className="text-sm text-muted-foreground">Loading categories...</p>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Failed to load categories. Please try again.
          </p>
        )}

        {!isPending && !isError && filteredCategories.length === 0 && (
          <p className="text-sm text-muted-foreground">No categories found.</p>
        )}

        {!isPending &&
          !isError &&
          filteredCategories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={value.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />

              <span className="text-sm">{category.name}</span>
            </label>
          ))}
      </div>
    </div>
  );
}
