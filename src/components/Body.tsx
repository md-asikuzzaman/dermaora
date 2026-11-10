import { cn } from "cn";
import React from "react";

type BodyVariant = "b1" | "b2" | "b3" | "b4";
type BodyWeight = "normal" | "medium" | "semibold";

interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  variant?: BodyVariant;
  weight?: BodyWeight;
}

export default function Body({
  children,
  className = "",
  variant = "b1",
  weight = "normal",
  ...rest
}: BodyTextProps) {
  const variants: Record<BodyVariant, string> = {
    b1: "text-site-gray-600 text-sm md:text-base",
    b2: "text-site-gray-600 text-xs md:text-sm",
    b3: "text-site-gray-600 text-[11px] md:text-xs",
    b4: "text-site-gray-600 text-[10px]",
  };

  const weights: Record<BodyWeight, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  };

  return (
    <div
      className={cn(variants[variant], weights[weight], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
