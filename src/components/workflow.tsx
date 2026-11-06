"use client"

import type { WorkflowStep } from "@/data/workflow"
import { cn } from "@/lib/utils"

// Steps before this index form a single line; the rest branch off in parallel.
const BRANCH_START = 4

// Entrance sequence, after the slogan has slid into the left half: the divider draws down, then the title,
// the flow chart rows one by one, and the arrows one by one.
const LINE_DELAY_MS = 350
const START_MS = 750
const enter = "animate__animated animate__fadeInUp [--animate-duration:800ms]"
const titleDelay = { animationDelay: `${START_MS}ms` }
const rowDelay = (row: number) => ({ animationDelay: `${START_MS + 250 + row * 120}ms` })
const arrowDelay = (order: number) => ({ animationDelay: `${START_MS + 1100 + order * 120}ms` })

function FlowNode({ step, compact = false }: { step: WorkflowStep; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-full border border-foreground px-5 py-[clamp(8px,1.4vh,13px)] text-center text-[clamp(16px,1.45vw,21px)] leading-tight transition-colors duration-300 hover:border-ink hover:bg-highlight hover:text-ink",
        // Side-by-side branch nodes stack the index above the title to fit the half width.
        compact && "h-full flex-col gap-0.5 rounded-[28px] px-3 text-[clamp(15px,1.3vw,19px)]",
      )}
    >
      <span className="text-[11px] tracking-[0.08em] whitespace-nowrap tabular-nums opacity-70">{step.index}</span>
      {step.title}
    </div>
  )
}

// Vertical arrow pointing down that draws from the top; positioned by the caller.
function Arrow({ order, className }: { order: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      style={arrowDelay(order)}
      className={cn("relative block w-px origin-top animate-draw-down bg-foreground motion-reduce:animate-none", className)}
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

// The right half of the screen, beside the slogan (which the hero keeps on the left). On tablet and phone the
// slogan steps away instead and the chart takes the full width.
export function Workflow({ steps }: { steps: WorkflowStep[] }) {
  const linear = steps.slice(0, BRANCH_START)
  const branch = steps.slice(BRANCH_START)
  // Arrow draw order: the linear arrows first, then the branch stem, split and branch arrows.
  const branchOrder = BRANCH_START - 1

  return (
    <div className="relative grid h-full grid-cols-12 px-gutter">
      <span
        aria-hidden="true"
        style={{ animationDelay: `${LINE_DELAY_MS}ms` }}
        className="absolute inset-y-0 left-5/12 w-px origin-top animate-draw-down bg-border [animation-duration:800ms] motion-reduce:animate-none max-tab:hidden"
      />
      {/* The title sits centred over the steps, and the two are centred together in the screen height */}
      <div className="col-start-6 col-end-13 flex h-svh flex-col items-center justify-center py-[clamp(24px,5vh,56px)] pl-[clamp(20px,3vw,48px)] max-tab:col-span-12 max-tab:pl-0">
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
                <div style={rowDelay(index)} className={cn("w-full", enter)}>
                  <FlowNode step={step} />
                </div>
                {index < linear.length - 1 && <Arrow order={index} className={arrowHeight} />}
              </li>
            ))}
            <li className="w-full">
              {/* Branch: a stem from the last linear step splits into one arrow per parallel step */}
              <div aria-hidden="true" className="relative h-[clamp(26px,5vh,44px)]">
                <span
                  style={arrowDelay(branchOrder)}
                  className="absolute top-0 left-1/2 h-1/2 w-px origin-top animate-draw-down bg-foreground motion-reduce:animate-none"
                />
                <span
                  style={arrowDelay(branchOrder + 1)}
                  className="absolute top-1/2 right-[calc(25%-3px)] left-[calc(25%-3px)] h-px animate-draw-across bg-foreground motion-reduce:animate-none"
                />
                <Arrow order={branchOrder + 2} className="absolute top-1/2 bottom-0 left-[calc(25%-3px)]" />
                <Arrow order={branchOrder + 2} className="absolute top-1/2 right-[calc(25%-3px)] bottom-0" />
              </div>
              <ol style={rowDelay(BRANCH_START)} className={cn("grid grid-cols-2 gap-3", enter)}>
                {branch.map((step) => (
                  <li key={step.id}>
                    <FlowNode step={step} compact />
                  </li>
                ))}
              </ol>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
