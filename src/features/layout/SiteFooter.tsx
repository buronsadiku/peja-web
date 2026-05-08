import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const SiteFooter = () => {
  return (
    <footer className="bg-card border-t border-border py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-4xl font-black text-primary mb-6">PEJA FEST</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Kosovo&apos;s premier outdoor festival.
              <br />
              Four days of unforgettable experiences.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/activities"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Activities
                </Link>
                <Link
                  href="/news"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  News
                </Link>
                <Link
                  href="/gallery"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Gallery
                </Link>
                <Link
                  href="/register"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact</h4>
              <div className="space-y-3 text-muted-foreground">
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

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            &copy; 2026 Peja Outdoor Festival. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
