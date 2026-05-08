type ContactRowProps = {
  label: string;
  email: string;
};

export const ContactRow = ({ label, email }: ContactRowProps) => (
  <div className="border-border flex flex-col items-start justify-between gap-2 border-b py-5 tablet:flex-row tablet:items-center">
    <span className="text-muted-foreground type-body-small font-semibold uppercase tracking-widest">
      {label}
    </span>
    <a
      href={`mailto:${email}`}
      className="text-primary type-body font-semibold underline underline-offset-4"
    >
      {email}
    </a>
  </div>
);
