import type { SidebarNavGroup, SidebarNavItem } from "./types";

export const itemKey = (item: SidebarNavItem) => item.key ?? item.href;

export const resolveActiveKey = (
  groups: SidebarNavGroup[],
  pathname: string,
): string | null => {
  let bestKey: string | null = null;
  let bestLength = -1;
  for (const group of groups) {
    for (const item of group.items) {
      const matches =
        pathname === item.href || pathname.startsWith(`${item.href}/`);
      if (matches && item.href.length > bestLength) {
        bestKey = itemKey(item);
        bestLength = item.href.length;
      }
    }
  }
  return bestKey;
};
