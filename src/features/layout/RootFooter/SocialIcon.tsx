import { InstagramIcon } from "@peja/icons/InstagramIcon";
import { TikTokIcon } from "@peja/icons/TikTokIcon";

const SOCIAL_CONFIG = {
  IG: { Icon: InstagramIcon, href: "https://www.instagram.com/peja", label: "Instagram" },
  TT: { Icon: TikTokIcon, href: "https://www.tiktok.com/@peja", label: "TikTok" },
} as const;

type SocialPlatform = keyof typeof SOCIAL_CONFIG;

type SocialIconProps = {
  platform: SocialPlatform;
};

export const SocialIcon = ({ platform }: SocialIconProps) => {
  const { Icon, href, label } = SOCIAL_CONFIG[platform];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="border-border text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-full border transition-colors"
    >
      <Icon width={18} height={18} aria-hidden />
    </a>
  );
};
