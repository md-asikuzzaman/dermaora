"use client";

import Container from "@/components/Container";
import ProductShowSlider from "@/components/sliders/ProductShowSlider";
import { useBestSellerQuery } from "@/hooks/useBestSellerQuery";

interface Props {
  title: string;
  buttonText?: string;
  buttonLink?: string;
  editMode?: boolean;
}

export default function BestSellerSection({
  title,
  buttonText,
  buttonLink,
  editMode,
}: Props) {
  const { data: items, isLoading, isError } = useBestSellerQuery();

  if (isLoading || isError || !items?.length) {
    if (!editMode) return null;

    const message = isLoading
      ? "Loading best sellers..."
      : isError
        ? "Failed to load best sellers."
        : "No best seller products available.";

    return (
      <section className="bg-background py-5 md:py-10 lg:py-15">
        <Container>
          <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {message}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <Container>
        {/* Add SectionHeader here when needed */}

        {/* <SectionHeader
          title={title}
          link={buttonLink}
          buttonText={buttonText}
        /> */}

        <ProductShowSlider data={items} />
      </Container>
    </section>
  );
}
