"use client"

import type { ComponentProps, MouseEvent } from "react"

// The logo link: always a full page load of /, landing at the top (a reload of the same URL would otherwise
// restore the scroll position, putting the home page back mid-track).
export function HomeLink({ onClick, ...props }: Omit<ComponentProps<"a">, "href">) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    // Let modified clicks (new tab, new window, ...) behave as usual.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: "instant" })
    // A full load is the point here, not a client-side navigation.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/")
  }

  // eslint-disable-next-line @next/next/no-html-link-for-pages
  return <a href="/" onClick={handleClick} {...props} />
}
