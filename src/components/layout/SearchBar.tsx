"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    const searchValue = search.trim();

    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }

    params.delete("minPrice");
    params.delete("maxPrice");

    params.set("page", "1");

    router.push(`/products?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="hidden max-w-xl flex-1 md:block">
      <form
        onSubmit={handleSearch}
        className="flex h-11 items-center rounded-full border border-input bg-muted/50 px-4 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20"
      >
        <Search size={18} className="shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for skincare, brands and more..."
          className="w-full bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>
    </div>
  );
};

export default SearchBar;
