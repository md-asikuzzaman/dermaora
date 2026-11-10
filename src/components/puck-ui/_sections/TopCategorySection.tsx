"use client";

import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import PopularCategoriesSlider from "@/components/sliders/TopCategoriesSlider";
import { useTopCategoriesQuery } from "@/hooks/useTopCategoriesQuery";

interface Props {
  title: string;
  buttonText?: string;
  buttonLink?: string;
  editMode?: boolean;
}

export default function TopCategorySection({
  title,
  buttonText,
  buttonLink,
  editMode,
}: Props) {
  const { data: items, isLoading, isError } = useTopCategoriesQuery();

  if (isLoading || isError || !items?.length) {
    if (!editMode) return null;

    const message = isLoading
      ? "Loading featured categories..."
      : isError
        ? "Failed to load featured categories."
        : "No featured categories available.";

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
        <PopularCategoriesSlider items={items} />
      </Container>
    </section>
  );
}
