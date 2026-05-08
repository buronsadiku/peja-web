"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@peja/ui/components/Breadcrumb";
import { isLocale } from "@/lib/utils/isLocale";
import type { Subscription } from "@/lib/api/types";
import { KeepsakesActions } from "./KeepsakesActions";

type AppHeaderDesktopProps = {
  subscription: Subscription | null;
};

export const AppHeaderDesktop = ({ subscription }: AppHeaderDesktopProps) => {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => !isLocale(seg))
    .filter((seg) => seg !== "app");

  const crumbs = ["dashboard", ...segments];

  const lastCrumb = crumbs[crumbs.length - 1];
  const parentCrumbs = crumbs.slice(0, -1);
  const isKeepsakes = segments.includes("keepsakes");

  return (
    <header className="max-w-container desktop:flex mx-auto hidden h-16 w-full items-center justify-between px-6 py-3">
      <Breadcrumb>
        <BreadcrumbList className="type-caption">
          {parentCrumbs.map((crumb, i) => {
            const href =
              i === 0 ? "/app" : `/app/${segments.slice(0, i).join("/")}`;
            return (
              <React.Fragment key={crumb}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={href} className="capitalize">
                    {crumb}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          })}
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold capitalize">
              {lastCrumb}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {isKeepsakes && <KeepsakesActions subscription={subscription} />}
    </header>
  );
};
