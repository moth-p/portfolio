import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

function Icon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      className={cn("size-[19px] shrink-0", className)}
      {...props}
    />
  )
}

export function ArrowIcon({
  direction = "right",
  className,
}: {
  direction?: "left" | "right"
  className?: string
}) {
  return (
    <Icon className={cn(direction === "left" && "rotate-180", className)}>
      <path d="M3 10h13M11.5 5.5 16 10l-4.5 4.5" />
    </Icon>
  )
}

export function SunIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M10 2.5v1.25M10 16.25v1.25M2.5 10h1.25M16.25 10h1.25M4.7 4.7l.88.88M14.42 14.42l.88.88M15.3 4.7l-.88.88M5.58 14.42l-.88.88" />
      <circle cx="10" cy="10" r="3.5" />
    </Icon>
  )
}

export function MoonIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M16.4 12.8A7 7 0 0 1 7.2 3.6 7 7 0 1 0 16.4 12.8Z" />
    </Icon>
  )
}
