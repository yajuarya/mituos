import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MituOS - Premium Web Desktop Experience",
  description: "Experience a premium desktop operating system interface in your browser. MituOS offers a complete desktop environment with extensible apps, file management, and modern UI components built with Next.js.",
  keywords: "web desktop, operating system, browser OS, desktop interface, web apps, file manager, notepad, calculator, system monitor",
  authors: [{ name: "MituOS Team" }],
  creator: "MituOS",
  publisher: "MituOS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://172.171.199.162:3000"),
  openGraph: {
    title: "MituOS - Premium Web Desktop Experience",
    description: "Experience a premium desktop operating system interface in your browser with extensible apps and modern UI.",
    url: "http://172.171.199.162:3000",
    siteName: "MituOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MituOS Desktop Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MituOS - Premium Web Desktop Experience",
    description: "Experience a premium desktop operating system interface in your browser with extensible apps and modern UI.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
