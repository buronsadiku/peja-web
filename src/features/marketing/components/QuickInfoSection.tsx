import { Calendar, MapPin } from "lucide-react";

export const QuickInfoSection = () => {
  return (
    <section
      id="info"
      className="py-20 px-4 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-card rounded-2xl border border-border hover:border-primary transition-all group">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-2">WHEN</h3>
            <p className="text-muted-foreground">June 18-21, 2026</p>
            <p className="text-sm text-muted-foreground mt-1">
              4 Days of Activities
            </p>
          </div>

          <div className="text-center p-8 bg-card rounded-2xl border border-border hover:border-primary transition-all group">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-2">WHERE</h3>
            <p className="text-muted-foreground">Peja, Kosovo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Festival Grounds
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border-2 border-primary hover:scale-105 transition-all group">
            <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🎫</span>
            </div>
            <h3 className="text-2xl font-black mb-2">TICKETS</h3>
            <p className="text-primary text-xl">Free Entry</p>
            <p className="text-sm text-muted-foreground mt-1">
              Registration Required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
