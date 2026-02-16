import NavBar from "@/components/nav-bar";
import React from "react";

export default function MainLayout( { children }: { children: React.ReactNode } ) {
  return (
    <>
      <NavBar/> {/* This navbar only shows for routes inside the (main) group */ }
      { children }
    </>
  );
}