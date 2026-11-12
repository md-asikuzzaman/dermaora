import { cn } from "cn";
import React from "react";

interface Props extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

const Container = ({ children, className, ...args }: Props) => {
  return (
    <div className={cn("container mx-auto px-2 md:px-4", className)} {...args}>
      {children}
    </div>
  );
};

export default Container;
