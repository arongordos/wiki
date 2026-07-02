"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return theme === "light" ? (
    <Button variant="ghost" onClick={() => setTheme("dark")}>
      <Sun className="size-4" />
    </Button>
  ) : (
    <Button variant="ghost" onClick={() => setTheme("light")}>
      <Moon className="size-4" />
    </Button>
  );
}
