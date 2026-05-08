"use client";

import { useState } from "react";
import { LogOutIcon } from "@peja/icons/LogOutIcon";
import { ChevronsUpDownIcon } from "@peja/icons/ChevronsUpDownIcon";
import { SettingsIcon as SettingsIcon } from "@peja/icons/SettingsIcon";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@peja/ui/components/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@peja/ui/components/DropdownMenu";
import { Avatar, AvatarFallback } from "@peja/ui/components/Avatar";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { signOut } from "@/lib/auth/client";
import type { User } from "@/lib/api/types";

const initialsOf = (user: User): string => {
  const source = user.fullName?.trim() || user.email;
  const parts = source.split(/[\s@]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "U";
};

const displayName = (user: User): string =>
  user.fullName?.trim() || user.email.split("@")[0] || "Account";

type NavUserProps = {
  user: User;
};

export const NavUser = ({ user }: NavUserProps) => {
  const t = useTranslations();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      router.replace(appRoutes.auth.signIn);
      router.refresh();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar size="sm">
                <AvatarFallback className="type-caption font-semibold">
                  {initialsOf(user)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="type-body-small truncate font-semibold">
                  {displayName(user)}
                </span>
                <span className="type-caption text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <Avatar size="sm">
                  <AvatarFallback className="type-caption font-semibold">
                    {initialsOf(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="type-body-small truncate font-semibold">
                    {displayName(user)}
                  </span>
                  <span className="type-caption text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={appRoutes.app.settings}>
                  <SettingsIcon />
                  {t("nav_user__settings")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                void handleSignOut();
              }}
              disabled={signingOut}
            >
              <LogOutIcon />
              {signingOut ? t("nav_user__signing_out") : t("nav_user__log_out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
