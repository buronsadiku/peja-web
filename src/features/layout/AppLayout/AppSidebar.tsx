"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@peja/ui/components/Logo";
import { HomeIcon } from "@peja/icons/HomeIcon";
import { MessageSquareIcon } from "@peja/icons/MessageSquareIcon";
import { ImageIcon } from "@peja/icons/ImageIcon";
import { StarIcon } from "@peja/icons/StarIcon";
import { SettingsIcon } from "@peja/icons/SettingsIcon";
import { QrCodeIcon } from "@peja/icons/QrCodeIcon";
import { MonitorIcon } from "@peja/icons/MonitorIcon";
import { UserPlusIcon } from "@peja/icons/UserPlusIcon";
import { HelpCircleIcon } from "@peja/icons/HelpCircleIcon";
import { UsersIcon } from "@peja/icons/UsersIcon";
import { Sidebar } from "@/components/Sidebar";
import type { SidebarNavGroup } from "@/components/Sidebar";
import { appRoutes } from "@/lib/routes";
import type { User } from "@/lib/api/types";
import { NavUser } from "./NavUser";

type Translator = ReturnType<typeof useTranslations>;

const buildGroups = (t: Translator): SidebarNavGroup[] => [
  {
    items: [
      {
        label: t("sidebar__nav__home"),
        href: appRoutes.app.root,
        icon: HomeIcon,
      },
      {
        label: t("sidebar__nav__messages"),
        href: appRoutes.app.messages,
        icon: MessageSquareIcon,
        badge: 12,
      },
      {
        label: t("sidebar__nav__photos"),
        href: appRoutes.app.photos,
        icon: ImageIcon,
      },
      {
        label: t("sidebar__nav__keepsakes"),
        href: appRoutes.app.keepsakes,
        icon: StarIcon,
      },
      {
        label: t("sidebar__nav__guests"),
        href: appRoutes.app.guests,
        icon: UsersIcon,
        badge: 112,
      },
      {
        label: t("sidebar__nav__settings"),
        href: appRoutes.app.settings,
        icon: SettingsIcon,
      },
    ],
  },
  {
    label: t("sidebar__quick__title"),
    items: [
      {
        label: t("sidebar__quick__qr"),
        href: appRoutes.app.qrCode,
        icon: QrCodeIcon,
      },
      {
        label: t("sidebar__quick__kiosk"),
        href: appRoutes.app.kiosk,
        icon: MonitorIcon,
      },
      {
        label: t("sidebar__quick__invite"),
        href: "/app/invite",
        icon: UserPlusIcon,
      },
      { label: t("sidebar__quick__help"), href: "/help", icon: HelpCircleIcon },
    ],
  },
];

type AppSideBarProps = {
  user: User;
};

export const AppSideBar = ({ user }: AppSideBarProps) => {
  const t = useTranslations();
  const groups = buildGroups(t);

  return (
    <Sidebar
      header={<Logo />}
      groups={groups}
      footer={<NavUser user={user} />}
    />
  );
};
