import React, { createContext, useContext, useEffect, useState } from "react";
import { getTheme, setTheme as saveTheme } from "../lib/storage";

export type ThemeName = "brown" | "lavender" | "sage";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "brown",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(
    (getTheme() as ThemeName) || "brown"
  );

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    saveTheme(t);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
