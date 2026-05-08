import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peja Outdoor Festival — June 18-21, 2026",
  description:
    "Four days of incredible activities and music in the heart of Kosovo. Free entry, registration required.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return children;
};

export default RootLayout;
