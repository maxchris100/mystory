'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import authService from "../../services/auth";

export default function Topbar() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const ok = await authService.isAuthenticated();
      if (isMounted) setAuthenticated(ok);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={"/home"} ><Image src="/logo.png" alt="Renqar" width={32} height={32} className="rounded-md" /></Link>
          <span className="text-sm font-semibold tracking-wide text-muted-foreground">Renqar</span>
        </div>

        {
          !authenticated ?
            <div className="flex items-center gap-3">
              <Link href="/signin" className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-accent">
                Masuk
              </Link>
              <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90">
                Daftar
              </Link>
            </div>
            :
            <div></div>
        }

      </div>
    </div>
  );
}

