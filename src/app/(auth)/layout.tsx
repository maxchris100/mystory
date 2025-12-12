"use client";

import ClientLayout from "@/app/clientLayout";
import LoadingCircular from "@/components/LoadingCircular";
import { Suspense } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      {/* <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

        <main className="flex min-h-screen items-center justify-center">
          <div className="max-w-6xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div> */}
      <Suspense fallback={<LoadingCircular />}>
        {children}
      </Suspense>
    </ClientLayout>
  );
}
