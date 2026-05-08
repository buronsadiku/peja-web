import { ShieldIcon } from "@peja/icons/ShieldIcon";

type TrustNoteProps = {
  message: string;
};

export const TrustNote = ({ message }: TrustNoteProps) => (
  <div className="bg-secondary/15 border-secondary/40 rounded-12 flex items-start gap-2.5 border p-3.5">
    <ShieldIcon width={16} height={16} className="text-secondary mt-0.5 shrink-0" />
    <p className="type-body-small text-foreground/80 leading-relaxed">
      {message}
    </p>
  </div>
);
