"use client";

import { useSyncExternalStore } from "react";
import { SunIcon } from "@peja/icons/SunIcon";
import { MoonIcon } from "@peja/icons/MoonIcon";
import { useThemeStore } from "../utils/useThemeStore";
import { cn } from "../utils/cn";

const subscribe = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

export const ThemeToggle = ({ className }: { className?: string }) => {
  const theme = useThemeStore((s) => s.theme);
  const cycleTheme = useThemeStore((s) => s.cycleTheme);
  const mounted = useSyncExternalStore(
    subscribe,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );

  if (!mounted) {
    return (
      <button
        className={cn(
          "text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-10 items-center justify-center rounded-lg transition",
          className,
        )}
        aria-label="Toggle theme"
      >
        <span className="size-5" />
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-8 items-center justify-center rounded-lg transition",
        className,
      )}
      aria-label={`Current theme: ${theme}. Click to switch.`}
    >
      {theme === "light" && <SunIcon className="size-4" />}
      {theme === "dark" && <MoonIcon className="size-4" />}
    </button>
  );
};
