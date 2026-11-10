import Container from "@/components/Container";
import type { ComponentConfig } from "@puckeditor/core";

import { PLACEHOLDER_IMAGE } from "@/lib/utils";
import Link from "next/link";
import { GalleryImageField } from "../gallery/gallery-image-field";
import SafeImage from "../SafeImage";
import Tips from "./Tips";

interface BannerItem {
  photo: string;
  url: string;
}

interface Props {
  banners: BannerItem[];
  tips?: string;
}

export const BannerImagesPuck: ComponentConfig<Props> = {
  label: "Banner Images",

  fields: {
    banners: {
      type: "array",
      label: "Banner Images",
      getItemSummary: (_, index) => `Banner ${(index ?? 0) + 1}`,

      arrayFields: {
        photo: {
          type: "custom",
          label: "Banner Image",
          render: ({ value, onChange }) => (
            <GalleryImageField
              label="Banner Image"
              mode="single"
              value={typeof value === "string" ? value : null}
              onChange={(value) => onChange(value ?? "")}
              isEdit
            />
          ),
        },

        url: {
          type: "text",
          label: "Banner URL",
        },
      },
    },

    tips: {
      type: "custom",
      label: "Tips",
      render: () => (
        <Tips text="Add banner images from your gallery and provide an optional destination URL for each banner. Images automatically share the available width equally. On mobile, banners are displayed in a single column." />
      ),
    },
  },

  defaultProps: {
    banners: [
      { photo: PLACEHOLDER_IMAGE, url: "#" },
      { photo: PLACEHOLDER_IMAGE, url: "#" },
    ],
    tips: "",
  },

  render: ({ banners }) => {
    const validBanners = banners.filter((banner) => banner.photo);

    return (
      <section className="bg-background">
        <Container>
          <div
            className="grid grid-cols-1 gap-3 md:gap-4"
            style={{
              gridTemplateColumns: `repeat(${validBanners.length}, minmax(0, 1fr))`,
            }}
          >
            {validBanners.map((banner, index) => (
              <Link
                key={`${banner.photo}-${index}`}
                href={banner.url || "#"}
                className="block w-full overflow-hidden rounded-sm md:rounded-md"
              >
                <SafeImage
                  src={banner.photo}
                  width={1200}
                  height={500}
                  alt={`Banner ${index + 1}`}
                  className="h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    );
  },
};
