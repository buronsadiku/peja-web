"use client";

import { Fragment } from "react";
import {
  Sidebar as SidebarShell,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarSeparator,
} from "@peja/ui/components/Sidebar";
import { usePathname } from "@/i18n/navigation";
import { SidebarItem } from "./SidebarItem";
import { itemKey, resolveActiveKey } from "./utils";
import type { SidebarNavGroup } from "./types";

type SidebarProps = {
  header?: React.ReactNode;
  groups: SidebarNavGroup[];
  footer?: React.ReactNode;
};

export const Sidebar = ({ header, groups, footer }: SidebarProps) => {
  const pathname = usePathname();
  const activeKey = resolveActiveKey(groups, pathname);

  return (
    <SidebarShell>
      {header ? <SidebarHeader>{header}</SidebarHeader> : null}
      <SidebarContent className="px-1.5">
        {groups.map((group, index) => (
          <Fragment key={group.label ?? `group-${index}`}>
            {index > 0 ? <SidebarSeparator /> : null}
            <SidebarGroup>
              {group.label ? (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              ) : null}
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarItem
                    key={itemKey(item)}
                    item={item}
                    active={activeKey === itemKey(item)}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </Fragment>
        ))}
      </SidebarContent>
      {footer ? (
        <SidebarFooter className="border-sidebar-border border-t">
          {footer}
        </SidebarFooter>
      ) : null}
    </SidebarShell>
  );
};
