import Container from "@/components/Container";
import type { ComponentConfig } from "@puckeditor/core";
import HeroSlider from "../sliders/HeroSlider";
import { GalleryImageField } from "../gallery/gallery-image-field";
import Tips from "./Tips";
import { PLACEHOLDER_IMAGE } from "@/lib/utils";

export interface HeroSliderPuckSlideItem {
  photo: string;
  url: string;
}

interface Props {
  slides: HeroSliderPuckSlideItem[];
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

        url: {
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
      { photo: PLACEHOLDER_IMAGE, url: "#" },
      { photo: PLACEHOLDER_IMAGE, url: "#" },
      { photo: PLACEHOLDER_IMAGE, url: "#" },
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
