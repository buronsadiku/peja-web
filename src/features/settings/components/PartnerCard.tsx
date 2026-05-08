import { Avatar, AvatarFallback } from "@peja/ui/components/Avatar";
import { Badge } from "@peja/ui/components/Badge";
import { CameraIcon } from "@peja/icons/CameraIcon";
import { VerifiedDot } from "./VerifiedDot";

type PartnerCardProps = {
  initials: string;
  tint: string;
  name: string;
  role: string;
  email: string;
  badgeLabel: string;
  badgeVariant: "default" | "destructive";
};

export const PartnerCard = ({
  initials,
  tint,
  name,
  role,
  email,
  badgeLabel,
  badgeVariant,
}: PartnerCardProps) => (
  <div className="rounded-16 border-border bg-card flex gap-4.5 border p-6">
    <div className="relative shrink-0">
      <Avatar size="lg" className="type-h3 size-16">
        <AvatarFallback
          className="type-body-small text-primary-foreground font-semibold"
          style={{ background: tint }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <button
        type="button"
        className="border-border bg-card absolute -right-0.5 -bottom-0.5 flex size-5.5 cursor-pointer items-center justify-center rounded-full border"
      >
        <CameraIcon width={11} height={11} />
      </button>
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="type-h3 font-semibold">{name}</span>
        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
      </div>
      <div className="type-body-small text-muted-foreground mt-0.5">{role}</div>
      <div className="type-body-small text-muted-foreground mt-2.5">
        {email}
      </div>
      <div className="mt-2.5">
        <VerifiedDot ok />
      </div>
    </div>
  </div>
);
