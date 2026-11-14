"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getBrands } from "@/services/brand.service";

interface BrandFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function BrandFilter({ value, onChange }: BrandFilterProps) {
  const [search, setSearch] = useState("");

  const {
    data: brands = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  // Search brands by name
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [brands, search]);

  // Toggle selected brand slug
  const toggleBrand = (slug: string) => {
    const updatedBrands = value.includes(slug)
      ? value.filter((item) => item !== slug)
      : [...value, slug];

    onChange(updatedBrands);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands..."
          className="pl-9"
        />
      </div>

      {/* Brand List */}
      <div className="max-h-60 space-y-3 overflow-y-auto">
        {isPending && (
          <p className="text-sm text-muted-foreground">Loading brands...</p>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Failed to load brands. Please try again.
          </p>
        )}

        {!isPending && !isError && filteredBrands.length === 0 && (
          <p className="text-sm text-muted-foreground">No brands found.</p>
        )}

        {!isPending &&
          !isError &&
          filteredBrands.map((brand) => (
            <label
              key={brand.id}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={value.includes(brand.slug)}
                onCheckedChange={() => toggleBrand(brand.slug)}
              />

              <span className="text-sm">{brand.name}</span>
            </label>
          ))}
      </div>
    </div>
  );
}
