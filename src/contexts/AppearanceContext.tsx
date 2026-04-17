import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type AccentColor = "purple" | "blue" | "cyan" | "green" | "pink" | "orange";

interface AppearanceContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

const ACCENT_MAP: Record<AccentColor, string> = {
  purple: "258 100% 69%", // #a855f7
  blue: "217 91% 60%",   // #3b82f6
  cyan: "189 94% 43%",   // #06b6d4
  green: "142 71% 45%",  // #22c55e
  pink: "330 81% 60%",   // #ec4899
  orange: "25 95% 53%",  // #f97316
};

export const AppearanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem("vite-ui-theme") as Theme) || "dark"
  );
  
  const [accentColor, setAccentColorState] = useState<AccentColor>(
    (localStorage.getItem("vite-ui-accent") as AccentColor) || "purple"
  );

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Apply Accent Color
  useEffect(() => {
    const root = window.document.documentElement;
    const hslValue = ACCENT_MAP[accentColor];
    if (hslValue) {
      root.style.setProperty("--primary", hslValue);
    }
  }, [accentColor]);

  const setTheme = (theme: Theme) => {
    localStorage.setItem("vite-ui-theme", theme);
    setThemeState(theme);
  };

  const setAccentColor = (color: AccentColor) => {
    localStorage.setItem("vite-ui-accent", color);
    setAccentColorState(color);
  };

  return (
    <AppearanceContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance must be used within AppearanceProvider");
  return context;
};
