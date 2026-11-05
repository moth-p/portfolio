"use client"

import { Accordion } from "radix-ui"
import { useState } from "react"

import type { WorkflowStep } from "@/data/workflow"
import { cn } from "@/lib/utils"

// Steps before this index form a single line; the rest branch off in parallel.
const BRANCH_START = 5

// Entrance sequence: title, then the flow chart rows one by one, then the arrows draw one by one.
const enter = "animate__animated animate__fadeInUp [--animate-duration:800ms]"
const rowDelay = (row: number) => ({ animationDelay: `${250 + row * 120}ms` })
const arrowDelay = (order: number) => ({ animationDelay: `${1100 + order * 120}ms` })

function FlowNode({
  step,
  active,
  onSelect,
  compact = false,
}: {
  step: WorkflowStep
  active: boolean
  onSelect: (id: string) => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(step.id)}
      aria-current={active ? "step" : undefined}
      className={cn(
        "flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-foreground px-5 transition-colors duration-300 hover:bg-foreground/6 py-[clamp(8px,1.4vh,13px)] text-center text-[clamp(16px,1.45vw,21px)] leading-tight",
        // Side-by-side branch nodes stack the index above the title to fit the half width.
        compact && "h-full flex-col gap-0.5 rounded-[28px] px-3 text-[clamp(15px,1.3vw,19px)]",
        // The step whose slide is open on the right.
        active && "border-ink bg-highlight text-ink hover:bg-highlight",
      )}
    >
      <span className="text-[11px] tracking-[0.08em] whitespace-nowrap tabular-nums opacity-70">{step.index}</span>
      {step.title}
    </button>
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

export function Workflow({ steps }: { steps: WorkflowStep[] }) {
  const linear = steps.slice(0, BRANCH_START)
  const branch = steps.slice(BRANCH_START)
  // Arrow draw order: the linear arrows first, then the branch stem, split and branch arrows.
  const branchOrder = BRANCH_START - 1
  // The open accordion slide (hovered last); starts at step 01 on every appearance.
  const [activeId, setActiveId] = useState(steps[0]?.id ?? "")

  return (
    <div className="grid h-full grid-cols-12 px-gutter">
      <div className="col-span-6 flex h-svh flex-col pt-[clamp(36px,9vh,110px)] pr-[clamp(20px,3vw,48px)] max-tab:col-span-12 max-tab:pt-[clamp(28px,6vh,60px)] max-tab:pr-0">
        <div className={enter}>
          <span className="mb-[14px] block text-[11px] tracking-[0.12em] text-muted-foreground uppercase">How I work</span>
          <h2
            id="workflow-title"
            className="text-[clamp(44px,5.4vw,84px)] leading-[0.89] font-medium max-tab:mb-6 max-phone:text-[clamp(40px,12vw,56px)]"
          >
            Work Flow
          </h2>
        </div>

        <div className="flex flex-1 items-center justify-center pb-[clamp(24px,5vh,56px)]">
          <ol aria-label="Work flow steps" className="flex w-full max-w-[500px] flex-col items-center">
            {linear.map((step, index) => (
              <li key={step.id} className="flex w-full flex-col items-center">
                <div style={rowDelay(index)} className={cn("w-full", enter)}>
                  <FlowNode step={step} active={step.id === activeId} onSelect={setActiveId} />
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
                    <FlowNode step={step} active={step.id === activeId} onSelect={setActiveId} compact />
                  </li>
                ))}
              </ol>
            </li>
          </ol>
        </div>
      </div>

      {/* Full-height accordion: hovering a slide unfolds it, and the open step grows to fill the remaining space */}
      <Accordion.Root
        type="single"
        value={activeId}
        onValueChange={(value) => {
          // Clicking the open slide's trigger would collapse it; always keep one slide open.
          if (value) setActiveId(value)
        }}
        className={cn(
          "col-start-7 col-end-13 flex h-svh flex-col border-l border-border max-tab:col-span-12 max-tab:h-auto max-tab:border-t max-tab:border-l-0",
          "animate__animated animate__fadeInUp",
        )}
      >
        {steps.map((step) => (
          <Accordion.Item
            key={step.id}
            value={step.id}
            onMouseEnter={() => setActiveId(step.id)}
            className="flex min-h-0 grow-0 cursor-pointer flex-col overflow-hidden border-b border-border transition-[flex-grow] duration-500 ease-soft last:border-b-0 data-[state=open]:grow max-tab:last:border-b max-tab:data-[state=open]:grow-0"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full cursor-pointer items-center gap-4 px-[clamp(20px,2.6vw,44px)] py-[clamp(10px,1.9vh,18px)] text-left text-[clamp(18px,1.75vw,26px)] transition-colors data-[state=closed]:text-muted-foreground data-[state=closed]:hover:text-foreground max-tab:px-0">
                <span className="w-[30px] flex-none text-[11px] tracking-[0.08em] tabular-nums">{step.index}</span>
                <span className="flex-1">{step.title}</span>
                <span aria-hidden="true" className="relative size-3 flex-none">
                  <span className="absolute top-1/2 left-0 h-px w-full bg-current" />
                  <span className="absolute top-0 left-1/2 h-full w-px bg-current transition-transform duration-300 group-data-[state=open]:scale-y-0" />
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-[clamp(20px,2.6vw,44px)] pb-[clamp(14px,2.4vh,28px)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:duration-500 max-tab:px-0">
              <div className="pl-[46px] max-phone:pl-0">
                <p className="max-w-[560px] text-[clamp(16px,1.4vw,21px)] leading-relaxed text-muted-foreground">{step.brief}</p>
                <p className="mt-4 text-[clamp(11px,0.9vw,13px)] tracking-[0.08em] uppercase">
                  <span className="text-muted-foreground">Output — </span>
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
