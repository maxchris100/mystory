"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type React from "react";
import authService, { FirebaseLoginRequest } from "../../../../services/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedRole = role === "Lainnya" ? customRole : role;
    const response = await authService.register({ email: email, password: password, role: selectedRole });
    if (response) {
      const qp = new URLSearchParams({ email: email.trim() });
      if (next) qp.set("next", next);
      router.push(`/otp?${qp.toString()}`);
      return;
    }

  };

  const handleLoginFirebase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const loginReq: FirebaseLoginRequest = { idToken: idToken, provider: "google", };
      const response = await authService.loginWithFirebase(loginReq);
      if (response) {
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


  const slides = [
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
              Create your account
            </CardTitle>
            <CardDescription>
              Start designing your first project in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="border-input flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">-- Select Role --</option>
                  <option value="Architecture / Design Student">
                    Architecture / Design Student
                  </option>
                  <option value="Freelance Architect / Independent">
                    Freelance Architect / Independent
                  </option>
                  <option value="Architecture Firm">Architecture Firm</option>
                  <option value="Engineer / Consultant (Structure, MEP, etc.)">
                    Engineer / Consultant (Structure, MEP, etc.)
                  </option>
                  <option value="Hobbyist / Maker / 3D Enthusiast">
                    Hobbyist / Maker / 3D Enthusiast
                  </option>
                  <option value="Developer / Contractor">
                    Developer / Contractor
                  </option>
                  <option value="Government / Academic / Researcher">
                    Government / Academic / Researcher
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {role === "Other" && (
                <Input
                  type="text"
                  placeholder="Specify your role"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                />
              )}
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Processing..." : "Sign Up"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center gap-2">
              <span className="h-[1px] flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">Or Register with</span>
              <span className="h-[1px] flex-1 bg-gray-200" />
            </div>

            {/* Social login */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleLoginFirebase}
                disabled={loading}
                className="w-full justify-center"
              >
                <Image
                  src="/images/google.png"
                  height={18}
                  width={18}
                  alt="Google"
                />
                Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold hover:underline text-black"
              >
                Log in
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