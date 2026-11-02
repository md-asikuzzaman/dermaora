import type { Config } from "@puckeditor/core";

type Components = {
  HeadingBlock: {
    title: string;
    level: "h1" | "h2" | "h3";
  };

  TextBlock: {
    text: string;
  };

  ButtonBlock: {
    label: string;
    href: string;
  };
};

export const config: Config<Components> = {
  components: {
    HeadingBlock: {
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
    },

    TextBlock: {
      label: "Text",
      fields: {
        text: { type: "textarea" },
      },
      defaultProps: {
        text: "Write your content here...",
      },
      render: ({ text }) => <p>{text}</p>,
    },

    ButtonBlock: {
      label: "Button",
      fields: {
        label: { type: "text" },
        href: { type: "text" },
      },
      defaultProps: {
        label: "Get Started",
        href: "/contact",
      },
      render: ({ label, href }) => <a href={href}>{label}</a>,
    },
  },
};
