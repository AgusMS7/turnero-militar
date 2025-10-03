import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { authOptions } from "./utils/authOptions";
import { getServerSession, Session } from "next-auth";
import SessionProviderWrapper from "@/components/NextAuthComponents/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turnero Hospital Militar",
  description: "Turnero Hospital Militar",
  icons: {
    icon: [
      { url: "/crossIcon.ico", rel: "icon", type: "image/x-icon" },
      { url: "/crossIcon.png", rel: "icon", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await getServerSession(authOptions);
  return (
    <html lang="es-AR" className="min-h-screen scroll-smooth" data-theme="light">
      <head>
        <link rel="icon" href="/crossIcon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper session={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
