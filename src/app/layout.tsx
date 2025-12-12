import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "@/components/custom/CookieConsent";
import { Analytics } from '@vercel/analytics/next';
import { Bricolage_Grotesque } from "next/font/google";

export const metadata: Metadata = {
  title: "Renqar",
  description: "Renqar",
};

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${bricolageGrotesque.className} antialiased`}>
        {children}
        <Analytics />
        {/* <CookieConsent /> */}
      </body>
    </html>
  );
}
