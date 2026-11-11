import type { ComponentConfig } from "@puckeditor/core";

import Tips from "./Tips";
import TopCategorySection from "./_sections/TopCategorySection";

interface Props {
  title: string;
  buttonText?: string;
  buttonLink?: string;
  tips?: string;
}

export const FeaturedCategoryPuck: ComponentConfig<Props> = {
  label: "Featured Category",

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
        <Tips text="Featured Categories are fetched dynamically through React Query from /api/get-featured-categories. You can customize the section title, button label, and button link from the Puck editor." />
      ),
    },
  },

  defaultProps: {
    title: "Top Categories",
    buttonText: "View All",
    buttonLink: "/categories",
    tips: "",
  },

  render: ({ title, buttonText, buttonLink, puck }) => (
    <TopCategorySection
      title={title}
      buttonText={buttonText}
      buttonLink={buttonLink}
      editMode={puck.isEditing}
    />
  ),
};
