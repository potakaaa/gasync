"use client";

import { Check, Monitor, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const itemClassName = cn(
  "relative flex cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
);

export function GasyncThemeSettings() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Radix dropdown + next-themes must render after mount to avoid SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration gate
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="rounded-lg"
        disabled
        aria-label="Settings"
      >
        <Settings className="size-4 opacity-50" aria-hidden />
      </Button>
    );
  }

  const current = theme ?? "system";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="Settings"
        >
          <Settings className="size-4" aria-hidden />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className={cn(
            "z-50 min-w-44 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          <DropdownMenu.Label className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Appearance
          </DropdownMenu.Label>
          <DropdownMenu.Item
            className={itemClassName}
            onSelect={() => setTheme("light")}
          >
            <span className="flex items-center gap-2">
              <Sun className="size-4 shrink-0" aria-hidden />
              Light
            </span>
            <Check
              className={cn(
                "size-4 shrink-0",
                current !== "light" && "invisible",
              )}
              aria-hidden
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClassName}
            onSelect={() => setTheme("dark")}
          >
            <span className="flex items-center gap-2">
              <Moon className="size-4 shrink-0" aria-hidden />
              Dark
            </span>
            <Check
              className={cn(
                "size-4 shrink-0",
                current !== "dark" && "invisible",
              )}
              aria-hidden
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClassName}
            onSelect={() => setTheme("system")}
          >
            <span className="flex items-center gap-2">
              <Monitor className="size-4 shrink-0" aria-hidden />
              System
            </span>
            <Check
              className={cn(
                "size-4 shrink-0",
                current !== "system" && "invisible",
              )}
              aria-hidden
            />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
