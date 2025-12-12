"use client";

import ClientLayout from "@/app/clientLayout";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}