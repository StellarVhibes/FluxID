"use client";

import { ReactNode } from "react";
import Header from "@/app/components/Header";
import Feedback from "@/app/components/Feedback";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Feedback />
    </>
  );
}