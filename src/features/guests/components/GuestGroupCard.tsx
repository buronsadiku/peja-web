import { Avatar, AvatarFallback } from "@peja/ui/components/Avatar";
import { GuestAvatarStack } from "./GuestAvatarStack";

type GroupMember = {
  initials: string;
  tint: string;
};

type GuestGroupCardProps = {
  title: string;
  totalCount: number;
  recordedCount: number;
  tint: string;
  members: GroupMember[];
};

export const GuestGroupCard = ({
  title,
  totalCount,
  recordedCount,
  tint,
  members,
}: GuestGroupCardProps) => {
  return (
    <div className="rounded-16 border-border bg-card hover:bg-muted/50 cursor-pointer border p-4 transition-colors">
      <Avatar size="default">
        <AvatarFallback
          className="type-body-small text-primary-foreground font-semibold"
          style={{ background: tint }}
        >
          {title[0]}
        </AvatarFallback>
      </Avatar>
      <div className="type-body-small mt-3 leading-tight font-semibold">
        {title}
      </div>
      <div className="type-caption text-muted-foreground mt-0.5">
        {recordedCount} of {totalCount} recorded
      </div>
      <div className="mt-2.5">
        <GuestAvatarStack members={members} />
      </div>
    </div>
  );
};
