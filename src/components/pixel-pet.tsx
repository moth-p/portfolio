"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

// The pet loses one percent of energy every DRAIN_MS, also while the page is closed:
// the stored charge is the level at a point in time, and the current energy is derived from it.
const DRAIN_MS = 3000
const TIRED_AT = 25
const STORAGE_KEY = "portfolio-pet"
const HOP_MS = 700

type Charge = { level: number; at: number }
export type PetMood = "awake" | "tired" | "asleep"

// --- Stored charge, shared with other tabs through the storage event ---

const listeners = new Set<() => void>()
// Fallback when localStorage is unavailable (e.g. blocked site data).
let memoryCharge: string | null = null

function readStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeCharge(charge: Charge) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(charge))
  } catch {
    // Storage unavailable (private mode etc.): the pet just won't remember.
    memoryCharge = JSON.stringify(charge)
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

function parseCharge(raw: string | null): Charge | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<Charge>
    return typeof value.level === "number" && typeof value.at === "number" ? (value as Charge) : null
  } catch {
    return null
  }
}

function energyAt(charge: Charge | null, now: number) {
  if (!charge) return 100
  return Math.min(100, Math.max(0, Math.ceil(charge.level - (now - charge.at) / DRAIN_MS)))
}

// --- Sprite: 19×12 pixel grid. "o" outline, "b" body, "m" sword edge, "s" blade, "g" grip; a paw holds the sword up ---

const SPRITE = [
  "..oo......oo....m..",
  ".obbo....obbo..msm.",
  ".obbboooobbbo..msm.",
  "obbbbbbbbbbbbo.msm.",
  "obbbbbbbbbbbbo.msm.",
  "obbbbbbbbbbbbommmmm",
  "obbbbbbbbbbbboobgbo",
  "obbbbbbbbbbbboobgbo",
  "obbbbbbbbbbbbo.ooo.",
  ".obbbbbbbbbbo...m..",
  "..oooooooooo.......",
  "..o.o....o.o.......",
]

const pixelFill: Record<string, string> = {
  o: "fill-ink",
  g: "fill-ink",
  b: "fill-highlight",
  // The sword sits on the page background, so it uses theme colours to stay visible in dark mode.
  m: "fill-muted-foreground",
  s: "fill-background",
}

const spritePixels = SPRITE.flatMap((row, y) =>
  [...row].flatMap((cell, x) => (cell === "." ? [] : [{ x, y, fill: pixelFill[cell] }])),
)

type Pixels = [number, number][]

const eyes: Record<PetMood, Pixels> = {
  awake: [[4, 5], [4, 6], [9, 5], [9, 6]],
  tired: [[3, 6], [4, 6], [9, 6], [10, 6], [4, 7], [9, 7]],
  asleep: [[3, 6], [4, 7], [5, 6], [8, 6], [9, 7], [10, 6]],
}

// Rendered size of the sprite at scale 1; the hero scales it to fit its spot.
export const PET_WIDTH = 120
export const PET_HEIGHT = (PET_WIDTH * SPRITE.length) / SPRITE[0].length

// The sprite alone. Inside a `group` wrapper, data-walking swaps the idle motion for a walk cycle and
// data-facing="left" mirrors it.
export function PetSprite({ mood, hopping }: { mood: PetMood; hopping: boolean }) {
  return (
    <div className="relative group-data-[facing=left]:-scale-x-100">
      {mood === "asleep" && (
        <span aria-hidden="true" className="absolute -top-4 left-[52%] text-[15px] text-foreground">
          <span className="absolute animate-pet-z motion-reduce:animate-none">z</span>
          <span className="absolute -top-3 left-3 animate-pet-z text-[19px] [animation-delay:-1s] motion-reduce:animate-none">
            Z
          </span>
        </span>
      )}
      <svg
        viewBox={`0 0 ${SPRITE[0].length} ${SPRITE.length}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
        style={{ width: PET_WIDTH }}
        className={cn(
          "block overflow-visible group-data-walking:animate-pet-walk motion-reduce:animate-none",
          hopping ? "animate-pet-hop" : mood === "asleep" ? "animate-pet-breathe" : "animate-pet-bob",
        )}
      >
        {spritePixels.map(({ x, y, fill }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className={fill} />
        ))}
        <g className={cn("fill-ink", mood === "awake" && "animate-pet-blink [transform-box:fill-box] origin-center")}>
          {eyes[mood].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
          ))}
        </g>
      </svg>
    </div>
  )
}

export type PetEnergy = ReturnType<typeof usePetEnergy>

export function usePetEnergy() {
  const charge = parseCharge(useSyncExternalStore(subscribe, () => readStorage() ?? memoryCharge, () => null))
  const [now, setNow] = useState(() => Date.now())
  const [hopping, setHopping] = useState(false)

  // First visit: start the clock now.
  useEffect(() => {
    if (!parseCharge(readStorage() ?? memoryCharge)) writeCharge({ level: 100, at: Date.now() })
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!hopping) return
    const timer = window.setTimeout(() => setHopping(false), HOP_MS)
    return () => window.clearTimeout(timer)
  }, [hopping])

  const energy = energyAt(charge, now)
  const mood: PetMood = energy === 0 ? "asleep" : energy <= TIRED_AT ? "tired" : "awake"

  const recharge = () => {
    const at = Date.now()
    setNow(at)
    writeCharge({ level: 100, at })
    setHopping(true)
  }

  return { energy, mood, hopping, recharge }
}

// Energy line and recharge button, shown under the pet in the hero.
export function PetStatus({ energy, mood, recharge, className }: PetEnergy & { className?: string }) {
  return (
    <div className={cn("flex w-[200px] flex-col gap-3 bg-background max-phone:w-[170px]", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          {mood === "asleep" ? "Asleep" : "Energy"}
        </span>
        <span className="text-[15px] tabular-nums">{energy}%</span>
      </div>
      <div
        role="meter"
        aria-label="Pet energy"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={energy}
        className="relative h-px w-full bg-border"
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 -my-px transition-[width] duration-700 ease-soft",
            mood === "awake" ? "bg-foreground" : "bg-destructive",
          )}
          style={{ width: `${energy}%` }}
        />
      </div>
      <button
        type="button"
        onClick={recharge}
        disabled={energy === 100}
        className="mt-1 flex w-fit items-center gap-2.5 self-center rounded-full border border-foreground px-[18px] py-2.5 text-[13px] transition-colors duration-[250ms] hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-40 max-phone:self-start"
      >
        Recharge
      </button>
    </div>
  )
}
