import { PhoneIcon } from "@peja/icons/PhoneIcon";
import { MailIcon } from "@peja/icons/MailIcon";
import { LinkIcon } from "@peja/icons/LinkIcon";

export type ContactType = "phone" | "email" | "via";

type ContactIconProps = {
  type: ContactType;
};

export const ContactIcon = ({ type }: ContactIconProps) => {
  if (type === "phone")
    return <PhoneIcon width={12} height={12} className="text-muted-foreground" />;
  if (type === "via")
    return (
      <LinkIcon width={12} height={12} className="text-muted-foreground" />
    );
  return <MailIcon width={12} height={12} className="text-muted-foreground" />;
};
