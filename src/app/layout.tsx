import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peja — Capture Your Wedding Messages",
  description:
    "Let your guests leave audio messages, photos, and notes — and turn them into beautiful keepsakes.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return children;
};

export default RootLayout;
