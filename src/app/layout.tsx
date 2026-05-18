import type { Metadata } from "next";
import Script from "next/script";
import { Rubik, Noto_Sans } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "optional",
  adjustFontFallback: true,
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "optional",
  adjustFontFallback: true,
});

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
  return (
    <html
      lang="en"
      className={`${rubik.variable} ${notoSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-foreground min-h-screen">
        <Script id="peja-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('peja-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})()`}
        </Script>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
