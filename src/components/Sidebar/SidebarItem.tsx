"use client";

import { cn } from "@peja/ui/utils/cn";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@peja/ui/components/Sidebar";
import { Link } from "@/i18n/navigation";
import type { SidebarNavItem } from "./types";

type SidebarItemProps = {
  item: SidebarNavItem;
  active: boolean;
};

export const SidebarItem = ({ item, active }: SidebarItemProps) => {
  const { label, href, icon: Icon, badge, variant = "default" } = item;
  const warn = variant === "warn";

  return (
    <SidebarMenuItem>
      {badge != null ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
      <SidebarMenuButton
        asChild
        isActive={active}
        className={cn(
          warn &&
            "text-destructive hover:bg-destructive/10 hover:text-destructive data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive",
        )}
      >
        <Link href={href}>
          {Icon ? <Icon width={20} height={20} /> : null}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
