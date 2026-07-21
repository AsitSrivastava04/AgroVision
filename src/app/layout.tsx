import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AgroVision AI — Detect Crop Diseases Instantly",
  description:
    "AI-powered crop disease detection. Upload a photo of your plant leaf and get instant diagnosis, confidence scores, and treatment recommendations.",
  keywords: [
    "crop disease detection",
    "plant disease AI",
    "agriculture AI",
    "leaf disease",
    "farming technology",
  ],
  openGraph: {
    title: "AgroVision AI — Detect Crop Diseases Instantly",
    description:
      "Upload a leaf photo and get instant AI-powered disease diagnosis with treatment recommendations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
