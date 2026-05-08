type LegalSectionProps = {
  heading: string;
  body: React.ReactNode;
};

export const LegalSection = ({ heading, body }: LegalSectionProps) => (
  <div className="mt-8">
    <h2 className="type-h3 text-foreground font-semibold">{heading}</h2>
    <div className="text-muted-foreground type-body mt-4 leading-relaxed">{body}</div>
  </div>
);
