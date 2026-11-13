"use client"

import { Accordion } from "radix-ui"

import type { WorkflowStep } from "@/data/workflow"
import { cn } from "@/lib/utils"

// Steps before this index form a single line; the rest branch off in parallel.
const BRANCH_START = 4

// Entrance sequence, as the slogan leaves: the divider draws down, then the title, the flow chart rows one by one,
// the arrows one by one, and the step accordion rows one by one.
const LINE_DELAY_MS = 350
const START_MS = 750
const enter = "animate__animated animate__fadeInUp [--animate-duration:800ms]"
const titleDelay = { animationDelay: `${START_MS}ms` }
const rowDelay = (row: number) => ({ animationDelay: `${START_MS + 250 + row * 120}ms` })
const arrowDelay = (order: number) => ({ animationDelay: `${START_MS + 1100 + order * 120}ms` })
const itemDelay = (index: number) => ({ animationDelay: `${START_MS + 400 + index * 100}ms` })

function FlowNode({
  step,
  compact = false,
}: {
  step: WorkflowStep
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center rounded-full border border-ink bg-highlight px-14 py-[clamp(8px,1.4vh,13px)] text-center text-[clamp(16px,1.45vw,21px)] leading-tight text-ink",
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

// The flow chart in the left half of the screen, and an accordion with each step's brief filling the right half.
// On tablet the accordion stacks under the chart; on phone it is left out.
export function Workflow({ steps }: { steps: WorkflowStep[] }) {
  const linear = steps.slice(0, BRANCH_START)
  const branch = steps.slice(BRANCH_START)
  // Arrow draw order: the linear arrows first, then the branch stem, split and branch arrows.
  const branchOrder = BRANCH_START - 1

  return (
    <div className="relative grid h-svh grid-cols-12 content-center px-gutter pt-[calc(var(--spacing-header)+clamp(16px,3vh,32px))] pb-[clamp(24px,5vh,56px)]">
      <span
        aria-hidden="true"
        style={{ animationDelay: `${LINE_DELAY_MS}ms` }}
        className="absolute inset-y-0 left-1/2 w-px origin-top animate-draw-down bg-border [animation-duration:800ms] motion-reduce:animate-none max-tab:hidden"
      />
      {/* The left half, edge to edge past the gutter: the title and steps are centred in it */}
      <div className="col-span-6 -ml-gutter flex flex-col items-center px-[clamp(20px,3vw,48px)] max-tab:col-span-12 max-tab:ml-0 max-tab:px-0">
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

      {/* The right half, from under the header to the bottom of the screen and edge to edge: one step's brief is
          open at a time and fills whatever height the folded steps leave. On tablet it stacks under the chart at its
          natural height; on phone only the title and chart show. */}
      <Accordion.Root
        type="single"
        defaultValue={steps[0]?.id}
        className="absolute top-header right-0 bottom-0 left-1/2 flex flex-col max-tab:static max-tab:col-span-12 max-tab:mt-[clamp(20px,4vh,40px)] max-phone:hidden"
      >
        {steps.map((step, index) => (
          <Accordion.Item
            key={step.id}
            value={step.id}
            style={itemDelay(index)}
            className={cn(
              "flex min-h-0 flex-col overflow-hidden border-b border-border transition-[flex-grow] duration-500 ease-soft last:border-b-0 data-[state=open]:grow motion-reduce:transition-none max-tab:border-b max-tab:first:border-t",
              enter,
            )}
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full cursor-pointer items-center gap-4 px-[clamp(24px,3.5vw,56px)] py-[clamp(12px,2.2vh,22px)] text-left text-[clamp(18px,1.6vw,24px)] leading-tight transition-colors data-[state=closed]:text-muted-foreground data-[state=closed]:hover:text-foreground max-tab:px-0 max-tab:py-2.5 max-tab:text-base">
                <span className="w-10 flex-none text-[11px] tracking-[0.08em] tabular-nums opacity-70">{step.index}</span>
                <span className="flex-1">{step.title}</span>
                {/* Plus that turns into a minus while open */}
                <span aria-hidden="true" className="relative size-3 flex-none">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-data-[state=open]:scale-y-0" />
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            {/* The text sits out of flow so the step's height comes from its share of the column, not its content */}
            <Accordion.Content className="relative min-h-0 flex-1 max-tab:static">
              <div className="absolute inset-0 flex flex-col justify-between pr-[clamp(24px,3.5vw,56px)] pb-[clamp(16px,3vh,32px)] pl-[calc(clamp(24px,3.5vw,56px)+56px)] animate__animated animate__fadeIn [--animate-duration:500ms] max-tab:static max-tab:px-0 max-tab:pb-3 max-tab:pl-14">
                <p className="max-w-[520px] text-[clamp(16px,1.4vw,22px)] leading-normal text-muted-foreground max-tab:text-sm">
                  {step.brief}
                </p>
                <p className="mt-3 text-sm leading-normal">
                  <span className="mr-2 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">Output</span>
                  {step.output}
                </p>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}
