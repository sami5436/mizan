import type { Metadata, Viewport } from "next";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const arabic = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

const title = "Mizan · Gold Jewelry Price Calculator";
const description =
  "Break a gold jewelry quote into raw gold value, making charge, tax, and markup. Supports 18K, 21K, 22K, and 24K in KWD, USD, SAR, AED, and JOD, in English and Arabic.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Mizan",
  },
  description,
  applicationName: "Mizan",
  category: "finance",
  keywords: [
    "gold price calculator",
    "gold jewelry price",
    "making charge calculator",
    "21k gold price",
    "22k gold price",
    "gold markup",
    "حاسبة سعر الذهب",
    "المصنعية",
    "سعر جرام الذهب",
  ],
  authors: [{ name: "Mizan" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mizan",
    title,
    description,
    locale: "en_US",
    alternateLocale: ["ar_KW"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Mizan, a gold jewelry price breakdown calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: "Mizan", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#f4efe7",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${sans.variable} ${arabic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
