"use client"

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

type FadeInUpProps<T extends ElementType> = { as?: T; play?: boolean } & ComponentPropsWithoutRef<T>

// Split text into word units; inline elements (e.g. <em>) stay whole as a single unit.
function splitWords(children: ReactNode, unitClass: string): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(/(\s+)/)
        .map((part, index) =>
          part === "" || /^\s+$/.test(part) ? (
            part
          ) : (
            <span key={index} data-fade-unit className={unitClass}>
              {part}
            </span>
          ),
        )
    }
    if (isValidElement<{ className?: string }>(child) && child.type !== "br") {
      const element = child as ReactElement<{ className?: string; "data-fade-unit"?: boolean }>
      return cloneElement(element, {
        "data-fade-unit": true,
        className: cn(element.props.className, unitClass),
      })
    }
    return child
  })
}

// Animate.css fadeInUp, played line by line each time the element scrolls into view, or whenever `play` turns
// true when the caller controls it.
export function FadeInUp<T extends ElementType = "div">({ as, play, children, ...props }: FadeInUpProps<T>) {
  const Component: ElementType = as ?? "div"
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const controlled = play !== undefined
  const visible = controlled ? play : inView

  // Tag each word with its rendered line index; re-measure when the width changes.
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => {
      const units = element.querySelectorAll<HTMLElement>("[data-fade-unit]")
      let line = -1
      let lastTop = -Infinity
      units.forEach((unit) => {
        const top = unit.offsetTop
        if (top > lastTop + 2) {
          line += 1
          lastTop = top
        }
        unit.style.setProperty("--fade-line", String(line))
      })
    }
    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])

  // Play on entering the viewport, reset on leaving so it replays next time.
  useEffect(() => {
    const element = ref.current
    if (!element || controlled) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.2) setInView(true)
        else if (!entry.isIntersecting) setInView(false)
      },
      { threshold: [0, 0.2] },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [controlled])

  // Each line starts 120ms after the one above it.
  const unitClass = cn(
    "inline-block [animation-delay:calc(var(--fade-line,0)*120ms)]",
    visible ? "animate__animated animate__fadeInUp" : "opacity-0",
  )

  return (
    <Component ref={ref} {...props}>
      {splitWords(children, unitClass)}
    </Component>
  )
}
