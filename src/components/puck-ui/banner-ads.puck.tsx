import Container from "@/components/Container";
import type { ComponentConfig } from "@puckeditor/core";

import { GalleryImageField } from "../gallery/gallery-image-field";
import Tips from "./Tips";
import FeaturedCard from "../cards/FeaturedCard";

interface BannerItem {
  photo: string;
  url: string;
}

interface Props {
  banners: BannerItem[];
  tips?: string;
}

export const BannerAdsPuck: ComponentConfig<Props> = {
  label: "Banner Ads",

  fields: {
    banners: {
      type: "array",
      label: "Banners (300x300px)",
      getItemSummary: (_, index) => `Banner ${(index ?? 0) + 1}`,

      arrayFields: {
        photo: {
          type: "custom",
          label: "Banner Image",
          render: ({ value, onChange }) => (
            <GalleryImageField
              label="Banner Image (300x300px)"
              mode="single"
              value={typeof value === "string" ? value : null}
              onChange={(value) => onChange(value ?? "")}
              isEdit
            />
          ),
        },

        url: {
          type: "text",
          label: "Banner Link",
        },
      },
    },

    tips: {
      type: "custom",
      label: "Tips",
      render: () => (
        <Tips text="Select banner images directly from your gallery. Recommended image dimensions are 300 × 300px. Banner content is managed through the Puck editor." />
      ),
    },
  },

  defaultProps: {
    banners: [
      { photo: "/images/demo/category-1.webp", url: "#" },
      { photo: "/images/demo/category-2.webp", url: "#" },
      { photo: "/images/demo/category-3.webp", url: "#" },
      { photo: "/images/demo/category-4.webp", url: "#" },
    ],
    tips: "",
  },

  render: ({ banners }) => {
    return (
      <section className="bg-background">
        <Container>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
            {banners?.map((banner, index) => (
              <FeaturedCard
                key={`${banner.photo}-${index}`}
                {...banner}
                i={index}
              />
            ))}
          </div>
        </Container>
      </section>
    );
  },
};
