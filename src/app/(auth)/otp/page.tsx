"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import authService from "../../../../services/auth";
import LoadingCircular from "@/components/LoadingCircular";

function OtpInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const next = searchParams.get("next");

    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(60);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // countdown timer untuk resend
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (val: string, idx: number) => {
        if (/^[0-9]?$/.test(val)) {
            const newOtp = [...otp];
            newOtp[idx] = val;
            setOtp(newOtp);
            // auto-focus ke next input
            if (val && idx < 5) {
                inputsRef.current[idx + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            const newOtp = [...otp];
            newOtp[idx - 1] = "";
            setOtp(newOtp);
            inputsRef.current[idx - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const code = otp.join("");
            const res = await authService.verifyOtp({ email: email, otp: code });
            if (res?.token) {
                if (next) {
                    router.push(next);
                } else {
                    router.push("/home");
                }
            } else {
                setError("Kode OTP salah.");
            }
        } catch (err) {
            setError("Gagal verifikasi OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setError("");
            setTimer(60);
            await authService.resendOtp({ email: email }); // isi payload sesuai kebutuhan backend
        } catch (err) {
            setError("Gagal mengirim ulang OTP.");
        }
    };

    return (
        <main className="min-h-dvh grid place-items-center p-6">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center gap-3">
                            <Image src="/logo.png" alt="Renqar" width={32} height={32} className="rounded-md" />
                        </div>
                        <CardTitle className="text-center text-2xl">Verifikasi OTP</CardTitle>
                        <CardDescription className="text-center">Masukkan 6 digit kode yang terkirim ke email</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el: any) => (inputsRef.current[idx] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="w-12 h-12 border-input border rounded-md text-center text-lg outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, idx)}
                                        onKeyDown={(e) => handleKeyDown(e, idx)}
                                        required
                                        aria-label={`Digit OTP ${idx + 1}`}
                                    />
                                ))}
                            </div>
                            {error && <p className="text-destructive text-sm text-center">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Memverifikasi..." : "Verifikasi"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        {timer > 0 ? (
                            <p className="text-muted-foreground text-sm">Kirim ulang OTP dalam {timer}s</p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                Kirim ulang OTP
                            </button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}

export default function OtpPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center"><LoadingCircular /></div>}>
            <OtpInner />
        </Suspense>
    );
}
