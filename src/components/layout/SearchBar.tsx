"use client";

import SearchForm from "./SearchForm";

interface SearchBarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function SearchBar({
  mobileOpen,
  onMobileClose,
}: SearchBarProps) {
  return (
    <>
      {/* Desktop Search */}
      <div className="hidden max-w-xl flex-1 md:block">
        <SearchForm />
      </div>

      {/* Mobile Search */}
      <div
        className={`absolute left-0 top-full w-full border-b bg-background shadow-md transition-all duration-300 md:hidden ${
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="px-4 py-4">
          <SearchForm mobile onMobileClose={onMobileClose} />
        </div>
      </div>
    </>
  );
}
