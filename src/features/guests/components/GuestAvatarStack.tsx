import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@peja/ui/components/Avatar";

type AvatarStackMember = {
  initials: string;
  tint: string;
};

type GuestAvatarStackProps = {
  members: AvatarStackMember[];
  maxVisible?: number;
};

export const GuestAvatarStack = ({
  members,
  maxVisible = 5,
}: GuestAvatarStackProps) => {
  const visible = members.slice(0, maxVisible);
  const remaining = members.length - maxVisible;

  return (
    <AvatarGroup>
      {visible.map((member, i) => (
        <Avatar key={`${member.initials}-${i}`} size="sm">
          <AvatarFallback
            className="text-primary-foreground type-caption font-semibold"
            style={{ background: member.tint }}
          >
            {member.initials}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <AvatarGroupCount>+{remaining}</AvatarGroupCount>
      )}
    </AvatarGroup>
  );
};
