"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandLogo } from "./BrandLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/activities", key: "activities" },
  { href: "/community", key: "community" },
  { href: "/news", key: "news" },
  { href: "/gallery", key: "gallery" },
] as const;

export const SiteNav = () => {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-2xl shadow-primary/5"
          : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20 xl:h-24">
          <Link
            href="/"
            className="flex-shrink-0 group cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            <BrandLogo className="h-10 xl:h-12 w-auto aspect-[390/169] text-primary group-hover:scale-105 transition-transform" />
          </Link>

          <div className="hidden xl:flex items-center gap-8 min-w-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-foreground hover:text-primary transition-colors group py-2 whitespace-nowrap"
              >
                <span className="relative z-10">{t(item.key)}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            {isHome && (
              <a
                href="#lineup"
                className="relative text-foreground hover:text-primary transition-colors group py-2 whitespace-nowrap"
              >
                <span className="relative z-10">{t("lineup")}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            )}
          </div>

          <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
            <Link
              href="/register"
              className="relative bg-primary text-primary-foreground px-8 py-2.5 rounded-full hover:bg-primary/90 transition-all font-bold overflow-hidden group whitespace-nowrap"
            >
              <span className="relative z-10">{t("register")}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <ThemeToggle />
            <LocaleSwitcher />
          </div>

          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="xl:hidden relative w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            <span className="sr-only">{tc("menu")}</span>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`xl:hidden overflow-hidden transition-all duration-500 ${
          isMenuOpen
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-card/98 backdrop-blur-xl border-t border-primary/20 shadow-2xl">
          <div className="px-6 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left py-3 px-4 text-lg hover:text-primary hover:bg-primary/10 rounded-xl transition-all border-l-4 border-transparent hover:border-primary"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="w-full block text-center bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all font-bold mt-4"
            >
              {t("register")}
            </Link>
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-border mt-4">
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
