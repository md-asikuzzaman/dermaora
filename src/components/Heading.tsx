import { ComponentPropsWithoutRef, ElementType } from "react";

type HeadingVariant = "medium" | "semibold" | "bold";
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "d1" | "d2";

interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  level?: HeadingLevel;
  variant?: HeadingVariant;
}

const Heading = ({
  level = "h2",
  variant = "bold",
  className = "",
  children,
  ...rest
}: HeadingProps) => {
  const tagMap: Record<HeadingLevel, ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    d1: "div",
    d2: "div",
  };

  const Tag = tagMap[level];

  const variantStyles: Record<HeadingVariant, string> = {
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const sizeStyles: Record<HeadingLevel, string> = {
    h1: "text-4xl md:text-[56px] text-site-gray-900",
    h2: "text-2xl md:text-[48px] text-site-gray-900",
    h3: "text-2xl md:text-[40px] text-site-gray-900",
    h4: "text-xl md:text-[28px] text-site-gray-900",
    h5: "text-base md:text-xl lg:text-[22px] text-site-gray-900",
    h6: "text-base md:text-lg text-site-gray-900",
    d1: "text-4xl sm:text-5xl md:text-[64px] lg:text-[72px] xl:text-[80px] text-site-gray-900",
    d2: "text-3xl sm:text-4xl md:text-[48px] lg:text-[56px] xl:text-[64px] text-site-gray-900",
  };

  const combinedClasses = [variantStyles[variant], sizeStyles[level], className]
    .join(" ")
    .trim();

  return (
    <Tag className={combinedClasses} {...rest}>
      {children}
    </Tag>
  );
};

export default Heading;
