"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type React from "react";
import { auth, googleProvider } from "@/lib/firebase";
import authService, { FirebaseLoginRequest, LoginRequest } from "../../../../services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [email, setEmail] = useState("owner@yopmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loginReq: LoginRequest = { email: email.trim(), password: password, };
      const response = await authService.login(loginReq);
      if (response) {
        if (response.route == "otp") {
          const qp = new URLSearchParams({ email: email.trim() });
          if (next) qp.set("next", next);
          router.push(`/otp?${qp.toString()}`);
          return;
        }
        const session = response.session;
        const user = response.user;
        if (next) {
          router.push(next);
        } else {
          router.push(`/home`);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLoginFirebase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingGoogle(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const loginReq: FirebaseLoginRequest = { idToken: idToken, provider: "google", };
      const response = await authService.loginWithFirebase(loginReq);
      if (response) {
        // console.log(response);
        const session = response.session;
        const user = response.user;
        if (next) {
          router.push(next);
        } else {
          router.push(`/home`);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingGoogle(false);
  };


  const slides = [
    { src: "/images/signin.jpg", alt: "" },
    { src: "/images/signup.jpg", alt: "" },
  ];
  return (
    <div className="grid h-screen w-full grid-cols-3">
      {/* Left side - form */}
      <div className="flex flex-col justify-center mx-auto w-full max-w-md col-span-3 md:col-span-1">
        <Card className="shadow-none border-none">
          <CardHeader>
            <div className="flex items-center gap-2 mb-16">
              <Image src="/logotext.png" alt="Renqar" width={150} height={50} style={{ width: "auto" }} />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Welcome back
            </CardTitle>
            <CardDescription>
              Login to continue your projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                {/* <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label> */}
                <Link href="/forgot" className="text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full">
                Log in
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleLoginFirebase}
                className="w-full justify-center"
              >
                <Image
                  src="/images/google.png"
                  height={18}
                  width={18}
                  alt="Google"
                />
                Continue with Google
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/register" className="font-bold text-black hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Right side - swiper images */}
      <div className="hidden md:flex relative col-span-2 h-full">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          // autoplay
          loop
          className="w-full h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
}