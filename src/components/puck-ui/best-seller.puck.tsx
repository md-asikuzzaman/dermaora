import type { ComponentConfig } from "@puckeditor/core";

import Tips from "./Tips";
import BestSellerSection from "./_sections/BestSellerSection";

interface Props {
  title: string;
  buttonText?: string;
  buttonLink?: string;
  paddingTop?: number;
  paddingBottom?: number;
  tips?: string;
}

export const BestSellerPuck: ComponentConfig<Props> = {
  label: "Best Seller",

  fields: {
    title: {
      type: "text",
      label: "Section Title",
    },

    buttonText: {
      type: "text",
      label: "Button Label",
    },

    buttonLink: {
      type: "text",
      label: "Button Link URL",
    },

    tips: {
      type: "custom",
      label: "Tips",
      render: () => (
        <Tips text="Best Seller products are fetched dynamically through React Query from /api/get-best-seller. You can customize the section title, button label, button link, and spacing from the Puck editor." />
      ),
    },
  },

  defaultProps: {
    title: "Best Seller",
    buttonText: "View All",
    buttonLink: "/best-seller",
    paddingTop: 0,
    paddingBottom: 0,
    tips: "",
  },

  render: ({ title, buttonText, buttonLink, puck }) => (
    <BestSellerSection
      title={title}
      buttonText={buttonText}
      buttonLink={buttonLink}
      editMode={puck.isEditing}
    />
  ),
};
