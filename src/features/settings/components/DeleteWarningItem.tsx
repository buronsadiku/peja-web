type DeleteWarningItemProps = {
  text: string;
};

export const DeleteWarningItem = ({ text }: DeleteWarningItemProps) => (
  <div className="type-body-small flex gap-2.5 py-1 leading-relaxed">
    <span className="text-destructive mt-0.5 shrink-0">&times;</span>
    {text}
  </div>
);
