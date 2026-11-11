import type { ComponentConfig } from "@puckeditor/core";

import Tips from "./Tips";
import PopularBrandSection from "./_sections/PopularBrandSection";

interface Props {
  title: string;
  buttonText?: string;
  buttonLink?: string;
  tips?: string;
}

export const PopularBrandsPuck: ComponentConfig<Props> = {
  label: "Popular Brands",

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
        <Tips text="Popular Brands are fetched dynamically through React Query from /api/get-popular-brands. You can customize the section title, button label, button link, and spacing from the Puck editor." />
      ),
    },
  },

  defaultProps: {
    title: "Popular Brands",
    buttonText: "View All",
    buttonLink: "/brands",
    tips: "",
  },

  render: ({ title, buttonText, buttonLink, puck }) => (
    <PopularBrandSection
      title={title}
      buttonText={buttonText}
      buttonLink={buttonLink}
      editMode={puck.isEditing}
    />
  ),
};
