import { cn } from "cn";
import React from "react";

interface Props extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

const Container = ({ children, className, ...args }: Props) => {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 md:px-5", className)} {...args}>
      {children}
    </div>
  );
};

export default Container;
