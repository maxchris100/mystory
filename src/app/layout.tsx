import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "@/components/custom/CookieConsent";
import { Analytics } from '@vercel/analytics/next';
import { Bricolage_Grotesque, Great_Vibes, Playfair_Display, Cinzel_Decorative, Dancing_Script } from "next/font/google";

export const metadata: Metadata = {
  title: "Wedding Invitation - 25 Dec 2025",
  description: "Join us at The Ritz-Carlton",
};

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const greatVibes = Great_Vibes({
  variable: '--font-great-vibes',
  subsets: ["latin"],
  weight: ["400"],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: '--font-cinzel',
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={`${bricolageGrotesque.className} ${greatVibes.variable} ${playfairDisplay.variable} ${cinzelDecorative.variable} ${dancingScript.variable} antialiased`}>
        {children}
        <Analytics />
        {/* <CookieConsent /> */}
      </body>
    </html>
  );
}
