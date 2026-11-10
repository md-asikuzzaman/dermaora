"use client";

import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import PopularBrandSlider from "@/components/sliders/PopularBrandSlider";
import { usePopularBrandsQuery } from "@/hooks/usePopularBrandsQuery";

interface Props {
  title: string;
  buttonText?: string;
  buttonLink?: string;
  editMode?: boolean;
}

export default function PopularBrandSection({
  title,
  buttonText,
  buttonLink,
  editMode,
}: Props) {
  const { data: items, isLoading, isError } = usePopularBrandsQuery();

  if (isLoading || isError || !items?.length) {
    if (!editMode) return null;

    const message = isLoading
      ? "Loading popular brands..."
      : isError
        ? "Failed to load popular brands."
        : "No popular brands available.";

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
        <SectionHeader
          title={title}
          link={buttonLink}
          buttonText={buttonText}
        />

        <PopularBrandSlider items={items} />
      </Container>
    </section>
  );
}
