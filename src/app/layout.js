import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jupiterax - Digital Marketplace",
  description: "Buy and sell digital products, templates, and creative assets. Join a growing community of creators and designers.",
  keywords: ["digital marketplace", "buy digital products", "sell templates", "creative assets", "e-commerce"],
  authors: [{ name: "Jupiterax" }],
  openGraph: {
    title: "Jupiterax - Digital Marketplace",
    description: "Buy and sell digital products, templates, and creative assets.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
        >
          <Provider>{children}</Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
