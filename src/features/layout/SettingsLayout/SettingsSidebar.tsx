"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@peja/ui/components/Logo";
import { UserIcon } from "@peja/icons/UserIcon";
import { LinkIcon } from "@peja/icons/LinkIcon";
import { SwatchIcon } from "@peja/icons/SwatchIcon";
import { PeopleIcon } from "@peja/icons/PeopleIcon";
import { LockIcon } from "@peja/icons/LockIcon";
import { BellIcon } from "@peja/icons/BellIcon";
import { CreditCardIcon } from "@peja/icons/CreditCardIcon";
import { BoxIcon } from "@peja/icons/BoxIcon";
import { WarningIcon } from "@peja/icons/WarningIcon";
import { Sidebar } from "@/components/Sidebar";
import type { SidebarNavGroup } from "@/components/Sidebar";
import { appRoutes } from "@/lib/routes";

type Translator = ReturnType<typeof useTranslations>;

const buildGroups = (t: Translator): SidebarNavGroup[] => [
  {
    label: t("settings__sidebar__settings"),
    items: [
      {
        key: "profile",
        label: t("settings__sidebar__profile"),
        href: appRoutes.settings.profile,
        icon: UserIcon,
      },
      {
        key: "link",
        label: t("settings__sidebar__link"),
        href: appRoutes.settings.link,
        icon: LinkIcon,
      },
      {
        key: "branding",
        label: t("settings__sidebar__branding"),
        href: appRoutes.settings.branding,
        icon: SwatchIcon,
      },
      {
        key: "access",
        label: t("settings__sidebar__access"),
        href: appRoutes.settings.access,
        icon: PeopleIcon,
      },
      {
        key: "privacy",
        label: t("settings__sidebar__privacy"),
        href: appRoutes.settings.privacy,
        icon: LockIcon,
      },
      {
        key: "notifications",
        label: t("settings__sidebar__notifications"),
        href: appRoutes.settings.notifications,
        icon: BellIcon,
      },
      {
        key: "billing",
        label: t("settings__sidebar__billing"),
        href: appRoutes.settings.billing,
        icon: CreditCardIcon,
      },
      {
        key: "data",
        label: t("settings__sidebar__data"),
        href: appRoutes.settings.data,
        icon: BoxIcon,
      },
      {
        key: "danger",
        label: t("settings__sidebar__danger"),
        href: appRoutes.settings.danger,
        icon: WarningIcon,
        variant: "warn",
      },
    ],
  },
];

export const SettingsSidebar = () => {
  const t = useTranslations();
  const groups = buildGroups(t);

  return <Sidebar header={<Logo />} groups={groups} />;
};
