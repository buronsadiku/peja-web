import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type CtaSectionProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  withBackdrop?: boolean;
};

export const CtaSection = ({
  title = "DON'T MISS OUT",
  subtitle = "Register now to secure your spot",
  ctaLabel = "Register Now",
  withBackdrop = true,
}: CtaSectionProps) => {
  return (
    <section
      id="about"
      className="py-32 px-4 bg-background relative overflow-hidden"
    >
      {withBackdrop && (
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1760135436773-af6c70a4dff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Festival atmosphere"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-black mb-8">{title}</h2>
        <p className="text-2xl md:text-3xl mb-12 text-muted-foreground">
          {subtitle}
        </p>
        <Link
          href="/register"
          className="bg-primary text-primary-foreground px-16 py-6 rounded-full text-xl hover:bg-primary/90 transition-all inline-flex items-center gap-3 group shadow-lg shadow-primary/50"
        >
          {ctaLabel}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
