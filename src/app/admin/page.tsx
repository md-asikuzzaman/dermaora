"use client";

import React from "react";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  return (
    <div>
      Admin Page
      <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>
    </div>
  );
};

export default AdminPage;
