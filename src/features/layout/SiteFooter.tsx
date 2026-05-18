import { Facebook, Instagram, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./BrandLogo";

export const SiteFooter = () => {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  return (
    <footer className="bg-card border-border border-t px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          <div>
            <BrandLogo className="text-primary mb-6 aspect-[390/169] h-16 w-auto" />
            <p className="text-muted-foreground mb-6 text-lg">
              {t("tagline")}
              <br />
              {t("tagline_two")}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/pejaoutdoorfestival/"
                className="bg-primary/20 hover:bg-primary/30 flex h-12 w-12 items-center justify-center rounded-full transition-all"
                aria-label="Instagram"
              >
                <Instagram className="text-primary h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61558655123555"
                className="bg-primary/20 hover:bg-primary/30 flex h-12 w-12 items-center justify-center rounded-full transition-all"
                aria-label="Facebook"
              >
                <Facebook className="text-primary h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-4 text-lg font-bold">{t("quick_links")}</h4>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary block transition-colors"
                >
                  {tn("home")}
                </Link>
                <Link
                  href="/activities"
                  className="text-muted-foreground hover:text-primary block transition-colors"
                >
                  {tn("activities")}
                </Link>
                <Link
                  href="/news"
                  className="text-muted-foreground hover:text-primary block transition-colors"
                >
                  {tn("news")}
                </Link>
                <Link
                  href="/gallery"
                  className="text-muted-foreground hover:text-primary block transition-colors"
                >
                  {tn("gallery")}
                </Link>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-primary block transition-colors"
                >
                  {tn("register")}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-bold">{t("contact")}</h4>
              <div className="text-muted-foreground space-y-3">
                <p>info@pejaoutdoorfestival.org</p>
                <p>
                  Festival Grounds
                  <br />
                  Peja, Kosovo
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground">{t("rights")}</p>
          <div className="text-muted-foreground flex gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              {t("privacy")}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
