"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { ButtonStyled } from "./ButtonStyled";
import { useTheme } from "@/layout/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // On vérifie si le thème actuel est "light" (ou s'il est par défaut sur light)
  const isLight = theme === "light";

  return (
    <ButtonStyled
      icon={
        isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
      }
      onClick={() => setTheme(isLight ? "dark" : "light")}
    />
  );
}
