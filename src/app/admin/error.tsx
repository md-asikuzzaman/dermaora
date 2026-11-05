"use client";

import { useEffect } from "react";

export default function PagesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PAGES_ERROR]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-10">
      <h2>Something went wrong!</h2>

      <p>Unable to load pages. Please try again.</p>

      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
