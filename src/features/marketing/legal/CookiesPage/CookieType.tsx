type CookieTypeProps = {
  label: string;
  body: string;
};

export const CookieType = ({ label, body }: CookieTypeProps) => (
  <p className="text-muted-foreground type-body mt-4 leading-relaxed">
    <strong className="text-foreground">{label}</strong> {body}
  </p>
);
