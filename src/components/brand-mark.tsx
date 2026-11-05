"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <Link
      href="/"
      aria-label="Go to home"
      onClick={() => {
        if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" })
      }}
      className={cn(
        "relative inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-current text-xs font-medium tracking-[-0.08em]",
        className,
      )}
    >
      <span>AV</span>
      <i className="absolute -right-1 -bottom-1 size-4 rounded-full border border-current bg-highlight" />
    </Link>
  )
}
