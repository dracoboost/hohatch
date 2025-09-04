"use client";

import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

import {Button} from "@/components/Button";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-8" />;
  }

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    if (window.pywebview && window.pywebview.api) {
      window.pywebview.api.save_settings({theme: newTheme});
    }
  };

  return (
    <Button
      isIconOnly
      aria-label="Toggle Theme"
      buttonSize="size-8"
      onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
};
