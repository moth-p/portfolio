"use client"

import { Accordion } from "radix-ui"
import { type ComponentType, useLayoutEffect, useRef } from "react"

import {
  PixelFlag,
  PixelGear,
  PixelLayers,
  PixelMagnifier,
  PixelPicture,
  PixelRocket,
} from "@/components/pixel-icons"
import type { WorkflowStep } from "@/data/workflow"
import { cn } from "@/lib/utils"

// Steps before this index form a single line; the rest branch off in parallel.
const BRANCH_START = 4

// Entrance sequence, as the slogan leaves: the divider draws down, then the title, the first flow chart step and the
// step accordion rows one by one. It fits in the hero's landing hold (about a second), so it's done before the
// scroll moves on; the other steps then follow the scroll (see `progress`).
const LINE_DELAY_MS = 100
const START_MS = 250
const enter = "animate__animated animate__fadeInUp [--animate-duration:600ms]"
const titleDelay = { animationDelay: `${START_MS}ms` }
const rowDelay = { animationDelay: `${START_MS + 100}ms` }
const itemDelay = (index: number) => ({ animationDelay: `${START_MS + 150 + index * 50}ms` })

// The pixel icon floating beside each step's brief, like the hero's.
const stepIcons: Record<string, ComponentType> = {
  scope: PixelMagnifier,
  references: PixelPicture,
  prototype: PixelGear,
  mvp: PixelRocket,
  "tech-stack": PixelLayers,
  implementation: PixelFlag,
}

// How far along `progress` is between `from` and `to`, 0 to 1.
const span = (progress: number, from: number, to: number) => Math.min(1, Math.max(0, (progress - from) / (to - from)))

// Scroll-driven parts ease toward their place, so wheel steps don't jump.
const follow = "transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"

// Step `index` shows as its brief unfolds: in the first half of the way from the previous step its connector
// draws (in `pieces` equal parts, one after another), in the second half the step itself fades in.
const connector = (progress: number, index: number, piece: number, pieces: number) =>
  span(progress, index - 1 + (piece * 0.5) / pieces, index - 1 + ((piece + 1) * 0.5) / pieces)
const reveal = (progress: number, index: number) => (index === 0 ? 1 : span(progress, index - 0.5, index))

function FlowNode({
  step,
  shown,
  compact = false,
}: {
  step: WorkflowStep
  shown: number
  compact?: boolean
}) {
  return (
    <div
      style={{ opacity: shown, transform: `translateY(${(1 - shown) * 14}px)` }}
      className={cn(
        follow,
        "relative flex w-full items-center justify-center rounded-full border border-ink bg-highlight px-14 py-[clamp(8px,1.4vh,13px)] text-center text-[clamp(16px,1.45vw,21px)] leading-tight text-ink max-tab:py-1.5",
        // Side-by-side branch nodes stack the index above the title to fit the half width.
        compact && "h-full flex-col gap-0.5 rounded-[28px] px-3 text-[clamp(15px,1.3vw,19px)]",
      )}
    >
      {/* Full-width nodes pin the index to the left edge so the title stays centred on the arrows */}
      <span
        className={cn(
          "text-[11px] tracking-[0.08em] whitespace-nowrap tabular-nums opacity-70",
          !compact && "absolute left-5",
        )}
      >
        {step.index}
      </span>
      <span className={cn("flex flex-col", !compact && "gap-1.5")}>
        {step.title}
        <span lang="zh-Hant" className="text-[0.62em] tracking-[0.15em] opacity-70">
          {step.titleTw}
        </span>
      </span>
    </div>
  )
}

// Vertical arrow pointing down, drawn from the top as far as `drawn` (0 to 1); positioned by the caller.
function Arrow({ drawn, className }: { drawn: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ transform: `scaleY(${drawn})` }}
      className={cn("relative block w-px origin-top bg-foreground", follow, className)}
    >
      <svg
        viewBox="0 0 10 6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        className="absolute -bottom-px left-1/2 w-[9px] -translate-x-1/2 text-foreground"
      >
        <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

const arrowHeight = "h-[clamp(14px,2.8vh,26px)]"

// The flow chart in the left half of the screen, and an accordion with each step's brief filling the right half.
// On tablet the accordion stacks under the chart; on phone it is left out.
// Scrolling walks through the steps: each one draws into the chart while its brief unfolds over the previous one.
export function Workflow({
  steps,
  progress,
  leaving,
  onSelect,
}: {
  steps: WorkflowStep[]
  /** Scroll position through the steps: 0 has the first one open, 1.5 has the second one halfway over the third */
  progress: number
  /** Leaving for the link section: the chart fades out to the left, the briefs to the right, the divider in place */
  leaving: boolean
  onSelect: (index: number) => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const linear = steps.slice(0, BRANCH_START)
  const branch = steps.slice(BRANCH_START)
  // The step that is mostly open counts as the open one (for its state, focus and the trigger colours).
  const activeIndex = Math.round(progress)
  // The branch: the stem and the left half of the split lead to the first parallel step, the right half to the second.
  const stem = connector(progress, BRANCH_START, 0, 3)
  const splits = [connector(progress, BRANCH_START, 1, 3), connector(progress, BRANCH_START + 1, 0, 2)]
  const branchArrows = [connector(progress, BRANCH_START, 2, 3), connector(progress, BRANCH_START + 1, 1, 2)]

  // Every brief is laid out at the open size, so it doesn't reflow while it folds or unfolds. The open size is
  // what's left of the accordion after every step's row (and the dividers between them).
  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    const measure = () => {
      let open = element.clientHeight
      for (const item of Array.from(element.children) as HTMLElement[]) {
        const header = item.firstElementChild as HTMLElement
        open -= item.offsetHeight - item.clientHeight + header.offsetHeight
      }
      element.style.setProperty("--open-size", `${Math.max(0, open)}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative grid h-svh grid-cols-12 content-center px-gutter pt-[calc(var(--spacing-header)+clamp(16px,3vh,32px))] pb-[clamp(24px,5vh,56px)]">
      <span
        aria-hidden="true"
        style={{ animationDelay: `${LINE_DELAY_MS}ms` }}
        className={cn(
          "absolute inset-y-0 left-1/2 w-px origin-top bg-border max-tab:hidden",
          leaving
            ? "animate__animated animate__fadeOut"
            : "animate-draw-down [animation-duration:800ms] motion-reduce:animate-none",
        )}
      />
      {/* The left half, edge to edge past the gutter: the title and steps are centred in it */}
      <div
        className={cn(
          "col-span-6 -ml-gutter flex flex-col items-center px-[clamp(20px,3vw,48px)] max-tab:col-span-12 max-tab:ml-0 max-tab:px-0",
          leaving && "animate__animated animate__fadeOutLeft",
        )}
      >
        <div style={titleDelay} className={enter}>
          <h2
            id="workflow-title"
            className="text-center text-[clamp(36px,3.8vw,60px)] leading-[0.89] font-medium max-phone:text-[clamp(32px,10vw,44px)]"
          >
            Work Flow
          </h2>
        </div>

        <div className="mt-[clamp(24px,5vh,48px)] flex w-full justify-center">
          <ol aria-label="Work flow steps" className="flex w-full max-w-[500px] flex-col items-center">
            {linear.map((step, index) => (
              <li key={step.id} className="flex w-full flex-col items-center">
                <div style={index === 0 ? rowDelay : undefined} className={cn("w-full", index === 0 && enter)}>
                  <FlowNode step={step} shown={reveal(progress, index)} />
                </div>
                {index < linear.length - 1 && (
                  <Arrow drawn={connector(progress, index + 1, 0, 1)} className={arrowHeight} />
                )}
              </li>
            ))}
            <li className="w-full">
              {/* Branch: a stem from the last linear step splits into one arrow per parallel step */}
              <div aria-hidden="true" className="relative h-[clamp(26px,5vh,44px)]">
                <span
                  style={{ transform: `scaleY(${stem})` }}
                  className={cn("absolute top-0 left-1/2 h-1/2 w-px origin-top bg-foreground", follow)}
                />
                {/* The split draws out from the stem, one half towards each parallel step */}
                <span
                  style={{ transform: `scaleX(${splits[0]})` }}
                  className={cn("absolute top-1/2 right-1/2 left-[calc(25%-3px)] h-px origin-right bg-foreground", follow)}
                />
                <span
                  style={{ transform: `scaleX(${splits[1]})` }}
                  className={cn("absolute top-1/2 right-[calc(25%-3px)] left-1/2 h-px origin-left bg-foreground", follow)}
                />
                <Arrow drawn={branchArrows[0]} className="absolute top-1/2 bottom-0 left-[calc(25%-3px)]" />
                <Arrow drawn={branchArrows[1]} className="absolute top-1/2 right-[calc(25%-3px)] bottom-0" />
              </div>
              <ol className="grid grid-cols-2 gap-3">
                {branch.map((step, index) => (
                  <li key={step.id}>
                    <FlowNode step={step} shown={reveal(progress, BRANCH_START + index)} compact />
                  </li>
                ))}
              </ol>
            </li>
          </ol>
        </div>
      </div>

      {/* The right half, from under the header to the bottom of the screen and edge to edge: one step's brief is
          open at a time and fills whatever height the folded steps leave. On tablet it stacks under the chart at its
          natural height; on phone only the title and chart show. */}
      <Accordion.Root
        ref={root}
        type="single"
        value={steps[activeIndex]?.id ?? ""}
        onValueChange={(value) => {
          const index = steps.findIndex((step) => step.id === value)
          if (index >= 0) onSelect(index)
        }}
        className={cn(
          "absolute top-header right-0 bottom-0 left-1/2 flex flex-col max-tab:static max-tab:col-span-12 max-tab:mt-[clamp(20px,4vh,40px)] max-tab:h-[clamp(300px,40vh,380px)] max-phone:hidden",
          leaving && "animate__animated animate__fadeOutRight",
        )}
      >
        {steps.map((step, index) => {
          const Icon = stepIcons[step.id]
          return (
            <Accordion.Item
              key={step.id}
              value={step.id}
              // How far this step's brief is unfolded, tied directly to the scroll like the project slides.
              style={{ flexGrow: Math.max(0, 1 - Math.abs(progress - index)), ...itemDelay(index) }}
              className={cn(
                "flex min-h-0 flex-col overflow-hidden border-b border-border last:border-b-0 max-tab:border-b max-tab:first:border-t",
                enter,
              )}
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full cursor-pointer items-center gap-4 px-[clamp(24px,3.5vw,56px)] py-[clamp(12px,2.2vh,22px)] text-left text-[clamp(18px,1.6vw,24px)] leading-tight transition-colors data-[state=closed]:text-muted-foreground data-[state=closed]:hover:text-foreground max-tab:px-0 max-tab:py-2.5 max-tab:text-base">
                  <span className="w-10 flex-none text-[11px] tracking-[0.08em] tabular-nums opacity-70">{step.index}</span>
                  <span className="flex flex-1 flex-wrap items-baseline gap-x-3">
                    {step.title}
                    <span lang="zh-Hant" className="text-[0.62em] tracking-[0.15em] opacity-70">
                      {step.titleTw}
                    </span>
                  </span>
                  {/* Plus that turns into a minus while open */}
                  <span aria-hidden="true" className="relative size-3 flex-none">
                    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                    <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-data-[state=open]:scale-y-0" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              {/* Kept mounted so a folding brief stays in place while it's covered; the text sits out of flow at the open
                  size, so the step's height comes from its share of the column, not its content */}
              <Accordion.Content forceMount inert={index !== activeIndex} className="relative min-h-0 flex-1">
                <div className="absolute inset-x-0 top-0 flex h-(--open-size) flex-col justify-between pr-[clamp(24px,3.5vw,56px)] pb-[clamp(16px,3vh,32px)] pl-[calc(clamp(24px,3.5vw,56px)+56px)] max-tab:justify-start max-tab:px-0 max-tab:pb-3 max-tab:pl-14">
                  {/* The brief with its pixel icon floating off its bottom right corner, like the hero's */}
                  <div className="flex items-end gap-[clamp(16px,2vw,32px)]">
                    <div className="max-w-[520px] text-[clamp(16px,1.4vw,22px)] leading-normal text-muted-foreground max-tab:text-sm">
                      <p>{step.brief}</p>
                      <p lang="zh-Hant" className="mt-2 text-[0.8em] tracking-[0.15em]">
                        {step.briefTw}
                      </p>
                    </div>
                    {Icon && (
                      <div aria-hidden="true" className="w-[clamp(44px,4.4vw,72px)] flex-none max-tab:w-10">
                        <div style={{ animationDelay: `${-index}s` }} className="animate-float motion-reduce:animate-none">
                          <Icon />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </div>
  )
}
