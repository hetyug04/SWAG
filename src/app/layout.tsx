import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const cascadiaCode = localFont({
  src: [
    {
      path: "./fonts/CascadiaCode-VariableFont_wght.ttf",
      style: "normal",
      weight: "200 900",
    },
    {
      path: "./fonts/CascadiaCode-Italic-VariableFont_wght.ttf",
      style: "italic",
      weight: "200 900",
    },
  ],
  variable: "--font-cascadia",
  display: "swap",
});

export const metadata: Metadata = {
  title: "#ShadowWizardAIGang",
  description: "This is a AI - Pluto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cascadiaCode.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
