import { Render } from "@puckeditor/core";
import { notFound } from "next/navigation";

import { config } from "@/components/puck/config";
import { Suspense } from "react";
import { PageResponse } from "@/types/puck.type";

export default async function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageRenderer />
    </Suspense>
  );
}

const HomePageRenderer = async () => {
  const response = await fetch(`${process.env.APP_URL}/api/pages?slug=home`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch homepage");
  }

  const result: PageResponse = await response.json();

  return <Render config={config} data={result.data.content} />;
};
