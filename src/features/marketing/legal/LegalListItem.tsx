type LegalListItemProps = {
  label: string;
  text: string;
};

export const LegalListItem = ({ label, text }: LegalListItemProps) => (
  <li>
    <strong className="text-foreground">{label}:</strong> {text}
  </li>
);
