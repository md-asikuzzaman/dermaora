import React from "react";

interface Props {
  readonly children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  return <div>{children}</div>;
};

export default Layout;
