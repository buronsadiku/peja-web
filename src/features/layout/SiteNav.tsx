"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/activities", label: "Activities" },
  { href: "/gallery", label: "Gallery" },
] as const;

export const SiteNav = () => {
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link
            href="/"
            className="flex-shrink-0 group cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            <h1 className="text-2xl md:text-3xl font-black text-primary group-hover:scale-105 transition-transform">
              PEJA<span className="text-white">.</span>FEST
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-foreground hover:text-primary transition-colors group py-2"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            {isHome && (
              <>
                <a
                  href="#about"
                  className="relative text-foreground hover:text-primary transition-colors group py-2"
                >
                  <span className="relative z-10">About</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
                <a
                  href="#lineup"
                  className="relative text-foreground hover:text-primary transition-colors group py-2"
                >
                  <span className="relative z-10">Lineup</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
                <a
                  href="#info"
                  className="relative text-foreground hover:text-primary transition-colors group py-2"
                >
                  <span className="relative z-10">Info</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              </>
            )}
            <Link
              href="/register"
              className="relative bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-all font-bold overflow-hidden group"
            >
              <span className="relative z-10">Register</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            <span className="sr-only">Menu</span>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          isMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-card/98 backdrop-blur-xl border-t border-primary/20 shadow-2xl">
          <div className="px-6 py-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left py-4 px-4 text-lg hover:text-primary hover:bg-primary/10 rounded-xl transition-all border-l-4 border-transparent hover:border-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="w-full block text-center bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all font-bold mt-4"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
