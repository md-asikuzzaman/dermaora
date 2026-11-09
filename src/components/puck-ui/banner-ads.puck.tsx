import Container from "@/components/Container";
import type { ComponentConfig } from "@puckeditor/core";
import { PLACEHOLDER_IMAGE } from "@/lib/utils";
import FeaturedCard from "../cards/FeaturedCard";
import { GalleryImageField } from "../gallery/gallery-image-field";
import Tips from "./Tips";

export interface BannerAdsPuckBannerItem {
  photo: string;
  url: string;
}

interface Props {
  banners: BannerAdsPuckBannerItem[];
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
        <Tips text="Select banner images directly from your gallery. Recommended image dimensions are 300 &times; 300px. Banner content is managed through the Puck editor." />
      ),
    },
  },

  defaultProps: {
    banners: [
      { photo: PLACEHOLDER_IMAGE, url: "#" },
      { photo: PLACEHOLDER_IMAGE, url: "#" },
      { photo: PLACEHOLDER_IMAGE, url: "#" },
      { photo: PLACEHOLDER_IMAGE, url: "#" },
    ],
    tips: "",
  },

  render: ({ banners }) => {
    return (
      <section className="bg-background">
        <Container>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
            {banners.map((banner, index) => (
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
