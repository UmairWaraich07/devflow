"use client";
import { document } from "postcss";
import React, { useState, useEffect, createContext, useContext } from "react";

interface ThemeContextTypes {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextTypes | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState("");

  const handleThemeChange = () => {
    if (mode === "light") {
      setMode("light");
      document.documentElement.classList.add("light");
    }
    if (mode === "dark") {
      setMode("dark");
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
