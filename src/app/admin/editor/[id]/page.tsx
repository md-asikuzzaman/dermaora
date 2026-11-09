import PageEditor from "@/puck/editor";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditPage({ params }: Props) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditPageContent params={params} />
    </Suspense>
  );
}

async function EditPageContent({ params }: Props) {
  const { id } = await params;

  return <PageEditor pageId={id} />;
}
