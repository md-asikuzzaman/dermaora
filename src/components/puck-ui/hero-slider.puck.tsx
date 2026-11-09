import Container from "@/components/Container";
import type { ComponentConfig } from "@puckeditor/core";
import HeroSlider from "../HeroSlider";
import { GalleryImageField } from "../gallery/gallery-image-field";
import Tips from "./Tips";

interface SlideItem {
  photo: string;
  link: string;
}

interface Props {
  slides: SlideItem[];
  tips?: string;
}

export const HeroSliderPuck: ComponentConfig<Props> = {
  label: "Hero Slider",

  fields: {
    slides: {
      type: "array",
      label: "Sliders (1240x465px)",
      getItemSummary: (_, index) => `Slider ${(index as number) + 1}`,

      arrayFields: {
        photo: {
          type: "custom",
          label: "Slider Image",
          render: ({ value, onChange }) => (
            <GalleryImageField
              label="Slider Image (1240x465px)"
              mode="single"
              value={typeof value === "string" ? value : null}
              onChange={(value) => onChange(value ?? "")}
              isEdit
            />
          ),
        },

        link: {
          type: "text",
          label: "Slide Link",
        },
      },
    },

    tips: {
      type: "custom",
      label: "Tips",
      render: () => (
        <Tips
          text="
          Select slider images directly from your gallery. Recommended image
          dimensions are 1240 &times; 465px. Slider content is managed through
          the Puck editor."
        />
      ),
    },
  },

  defaultProps: {
    slides: [
      { photo: "/images/placeholder.png", link: "#" },
      { photo: "/images/placeholder.png", link: "#" },
      { photo: "/images/placeholder.png", link: "#" },
    ],
    tips: "",
  },

  render: ({ slides }) => {
    return (
      <section className="bg-background">
        <Container>
          <HeroSlider data={slides} />
        </Container>
      </section>
    );
  },
};
