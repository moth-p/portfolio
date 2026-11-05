"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { MoonIcon, SunIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"

const subscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // The stored theme is only known on the client; avoid a hydration mismatch in the label.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const nextTheme = mounted && resolvedTheme === "dark" ? "light" : "dark"
  const label = `Switch to ${nextTheme} mode`

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setTheme(nextTheme)}
      aria-label={label}
      title={label}
      className="size-[42px] rounded-full border-border bg-background text-foreground shadow-none duration-[220ms] hover:rotate-12 hover:bg-foreground hover:text-background max-phone:size-[38px] dark:border-border dark:bg-background dark:hover:bg-foreground"
    >
      {/* Icon is picked by CSS so it is correct before hydration */}
      <SunIcon className="size-[18px] dark:hidden" />
      <MoonIcon className="hidden size-[18px] dark:block" />
    </Button>
  )
}
