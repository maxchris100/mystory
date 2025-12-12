'use client';

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import authService from "../../../services/auth";
import LoadingCircular from "@/components/LoadingCircular";
import { jwtDecode } from "jwt-decode";

export default function Rental() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const json = await authService.getSession();
      if (!isMounted) return;
      if (json?.authenticated && json?.token) {
        try {
          const decoded = jwtDecode(json.token);
          const pr = await authService.getProfileSession((decoded as any).ssid!);
          if (!isMounted) return;
          setProfile(pr.user);
          setAuthenticated(true);
        } catch {
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="flex flex-col min-h-screen w-full">
      <header className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="bg-primary/20 blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logotext.png" alt="Renqar" width={120} height={40} className="rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <Link href="/signin" className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-accent">
                Masuk
              </Link>
              <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90">
                Daftar
              </Link>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <h1 className="mx-auto max-w-4xl text-balance text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Selamat datang di Renqar</span>{" "}
              Rental Mobil
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
              With our partner
            </p>

          </div>
        </div>
      </header>


    </main>
  );
}
