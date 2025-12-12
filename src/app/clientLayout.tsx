"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const [authorized, setAuthorized] = useState(true);
    const hideSidebar = (
        pathname == "/"
        || pathname.startsWith("/otp")
        || pathname.startsWith("/design")
        || pathname.startsWith("/signin")
        || pathname.startsWith("/register")
        || pathname.endsWith("/home")
        || pathname === "/not-found"
    );
    const publicPaths = ["/", "/waiting-list", "/not-found"];

    if (!authorized) {
        return <></>; // tunggu redirect
    }
    return (
        <div>
            {!hideSidebar && <Sidebar />}
            <main className={`flex-1 ${hideSidebar ? "p-0" : "p-6"}`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </main>
        </div>
    );
}
