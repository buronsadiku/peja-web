import type { ComponentType, SVGProps } from "react";

export type SidebarNavItem = {
  key?: string;
  label: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  badge?: number | string;
  variant?: "default" | "warn";
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};
