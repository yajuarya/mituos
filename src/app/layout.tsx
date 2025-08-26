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
  title: "MituOS - Educational Web Desktop OS | Learn Operating Systems Interactively",
  description: "Discover operating system concepts through MituOS - an interactive web desktop built with Next.js. Features educational tutorials, concept mapping, and hands-on learning with apps like notepad, calculator, and file manager.",
  keywords: "educational OS, operating systems learning, web desktop, interactive tutorials, OS concepts, process management, memory management, file systems, desktop interface, Next.js, TypeScript, educational software",
  authors: [{ name: "Yaju Arya", url: "http://yajuarya.com" }],
  creator: "Yaju Arya",
  publisher: "MituOS Educational Platform",
  category: "Education Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://172.171.199.162:3000"),
  openGraph: {
    title: "MituOS - Learn Operating Systems Through Interactive Web Desktop",
    description: "Master OS concepts with MituOS - an educational web desktop featuring interactive tutorials, concept mapping, and real-world examples. Perfect for students and developers learning operating systems.",
    url: "http://172.171.199.162:3000",
    siteName: "MituOS Educational Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MituOS Educational Desktop Interface - Learn OS Concepts Interactively",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MituOS - Interactive OS Learning Platform",
    description: "Learn operating system concepts through hands-on experience with MituOS web desktop. Educational tutorials, concept mapping, and interactive examples included.",
    images: ["/twitter-image.png"],
    creator: "@yajuarya",
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
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "educational-content": "operating-systems",
    "learning-level": "beginner-to-advanced",
    "interaction-type": "hands-on",
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
