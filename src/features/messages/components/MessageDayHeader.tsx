type MessageDayHeaderProps = {
  day: string;
  date: string;
  count: number;
};

export const MessageDayHeader = ({
  day,
  date,
  count,
}: MessageDayHeaderProps) => (
  <div className="border-border bg-background tablet:px-6 flex items-center gap-2.5 border-b px-4 py-3">
    <span className="type-body font-serif font-semibold">{day}</span>
    <span className="type-caption text-muted-foreground">&middot; {date}</span>
    <span className="border-border bg-card type-caption text-muted-foreground ml-auto rounded-full border px-2 py-0.5 font-semibold">
      {count} {count === 1 ? "message" : "messages"}
    </span>
  </div>
);
