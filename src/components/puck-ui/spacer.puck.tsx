import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";

interface Props {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

type SpacerStyles = CSSProperties & {
  "--spacer-mobile": string;
  "--spacer-tablet": string;
  "--spacer-desktop": string;
  "--spacer-wide": string;
};

export const SpacerPuck: ComponentConfig<Props> = {
  label: "Spacer",

  fields: {
    mobile: {
      type: "number",
      label: "Mobile (Default)",
      min: 0,
      max: 500,
    },
    tablet: {
      type: "number",
      label: "Tablet (sm: 640px)",
      min: 0,
      max: 500,
    },
    desktop: {
      type: "number",
      label: "Desktop (md: 768px)",
      min: 0,
      max: 500,
    },
    wide: {
      type: "number",
      label: "Large Desktop (lg: 1024px)",
      min: 0,
      max: 500,
    },
  },

  defaultProps: {
    mobile: 24,
    tablet: 32,
    desktop: 40,
    wide: 48,
  },

  render: ({ mobile = 24, tablet = 32, desktop = 40, wide = 48 }) => {
    const styles: SpacerStyles = {
      "--spacer-mobile": `${mobile}px`,
      "--spacer-tablet": `${tablet}px`,
      "--spacer-desktop": `${desktop}px`,
      "--spacer-wide": `${wide}px`,
    };

    return (
      <div
        aria-hidden="true"
        className="
          h-(--spacer-mobile)
          w-full
          shrink-0
          sm:h-(--spacer-tablet)
          md:h-(--spacer-desktop
          lg:h-(--spacer-wide)
        "
        style={styles}
      />
    );
  },
};
