import { Render } from "@puckeditor/core";
import { notFound } from "next/navigation";

import { config } from "@/components/puck/config";
import { getPublishedPageBySlug } from "@/services/page.service";
import { Suspense } from "react";
import { auth } from "@/lib/auth";

export default async function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageRenderer />
    </Suspense>
  );
}

const HomePageRenderer = async () => {
  const page = await getPublishedPageBySlug("home");

  const session = await auth();

  // session?.user.role;

  console.log(session, { s: session?.user.role });

  if (!page) {
    notFound();
  }

  return <Render config={config} data={page.content} />;
};
