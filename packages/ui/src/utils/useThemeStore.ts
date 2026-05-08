import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
};

const CYCLE_ORDER: Theme[] = ["light", "dark"];

const applyThemeToDOM = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",

      setTheme: (theme) => {
        set({ theme });
        applyThemeToDOM(theme);
      },

      cycleTheme: () => {
        const currentIndex = CYCLE_ORDER.indexOf(get().theme);
        const nextTheme = CYCLE_ORDER[(currentIndex + 1) % CYCLE_ORDER.length];
        get().setTheme(nextTheme);
      },
    }),
    {
      name: "theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDOM(state.theme);
      },
    },
  ),
);
