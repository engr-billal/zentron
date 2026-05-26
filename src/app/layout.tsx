import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zentronsolutions.com"),
  title: {
    default: "Zentron Solutions — The trust layer between brands × creators",
    template: "%s · Zentron Solutions",
  },
  description:
    "Algorithmic matching. Smart contracts. Milestone-based escrow. The infrastructure sponsored content has been missing.",
  keywords: [
    "influencer marketing",
    "creator economy",
    "brand creator platform",
    "escrow",
    "smart contracts",
    "Zentron",
  ],
  authors: [{ name: "Zentron Solutions" }],
  openGraph: {
    type: "website",
    title: "Zentron Solutions — The trust layer for the creator economy",
    description:
      "Algorithmic matching. Smart contracts. Milestone-based escrow.",
    siteName: "Zentron Solutions",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zentron Solutions",
    description:
      "The trust layer between brands × creators. Built for both sides.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
