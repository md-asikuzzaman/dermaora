import { ComponentConfig } from "@puckeditor/core";

export const HeadingBlock: ComponentConfig<{
  title: string;
  level: "h1" | "h2" | "h3";
}> = {
  label: "Heading",
  fields: {
    title: { type: "text" },
    level: {
      type: "select",
      options: [
        { label: "H1", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
      ],
    },
  },
  defaultProps: {
    title: "Welcome to my website",
    level: "h1",
  },
  render: ({ title, level }) => {
    const Tag = level;
    return <Tag>{title}</Tag>;
  },
};
