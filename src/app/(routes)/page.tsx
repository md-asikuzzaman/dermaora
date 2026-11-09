import { Render } from "@puckeditor/core";
import { notFound } from "next/navigation";
import { config } from "@/puck/config";
import { getPublishedPageBySlug } from "@/services/page.service";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageRenderer />
    </Suspense>
  );
}

const HomePageRenderer = async () => {
  const page = await getPublishedPageBySlug("home");

  if (!page) {
    notFound();
  }

  return <Render config={config} data={page.content} />;
};
