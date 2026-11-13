"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

// The pet loses one percent of energy every DRAIN_MS, also while the page is closed:
// the stored charge is the level at a point in time, and the current energy is derived from it.
const DRAIN_MS = 3000
const TIRED_AT = 25
const STORAGE_KEY = "portfolio-pet"
const HOP_MS = 700
// Loading or reloading the home page wakes the pet at this level.
const HOME_LOAD_LEVEL = 80
// Recharging tops the energy up to this level; it never lowers a fuller charge.
const RECHARGE_LEVEL = 80

type Charge = { level: number; at: number }
export type PetMood = "awake" | "tired" | "asleep"

// --- Stored charge, shared with other tabs through the storage event ---

const listeners = new Set<() => void>()
// Fallback when localStorage is unavailable (e.g. blocked site data).
let memoryCharge: string | null = null
// Module state survives client-side navigation, so this marks the first pet shown since the page loaded.
let loadHandled = false

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
  // In dark mode the pet is drawn reversed: light outline, grip and eyes on a dark body.
  o: "fill-ink dark:fill-foreground",
  g: "fill-ink dark:fill-foreground",
  b: "fill-highlight dark:fill-ink",
  // The sword sits on the page background, so it uses theme colours to stay visible in dark mode.
  m: "fill-muted-foreground",
  s: "fill-background",
}

// The reading pose on project pages, as tall as SPRITE but wider: a large open book (blank pages "p") held on the
// pet's right side where the sword was, in front of its body; the eyes look over at it.
const READING_SPRITE = [
  "..oo......oo.........",
  ".obbo....obbo........",
  ".obbboooobbboooo.oooo",
  "obbbbbbbbbbbopppopppo",
  "obbbbbbbbbbbopppopppo",
  "obbbbbbbbbbbopppopppo",
  "obbbbbbbbbbbopppopppo",
  "obbbbbbbbbbbopppopppo",
  "obbbbbbbbbbbopppopppo",
  ".obbbbbbbbbbooooooooo",
  "..oooooooooo.........",
  "..o.o....o.o.........",
]

const readingFill: Record<string, string> = {
  ...pixelFill,
  p: "fill-background",
}

function toPixels(sprite: string[], fills: Record<string, string>) {
  return sprite.flatMap((row, y) =>
    [...row].flatMap((cell, x) => (cell === "." ? [] : [{ x, y, fill: fills[cell] }])),
  )
}

const spritePixels = toPixels(SPRITE, pixelFill)
// For the attack, the paw and sword (from SWORD_X rightwards) swing as one around the grip (SWORD_PIVOT).
const SWORD_X = 14
const SWORD_PIVOT = "16.5px 7px"
const bodyPixels = spritePixels.filter(({ x }) => x < SWORD_X)
const swordPixels = spritePixels.filter(({ x }) => x >= SWORD_X)
const readingPixels = toPixels(READING_SPRITE, readingFill)

type Pixels = [number, number][]

const readingEyes: Pixels = [[5, 5], [5, 6], [10, 5], [10, 6]]

const eyes: Record<PetMood, Pixels> = {
  awake: [[4, 5], [4, 6], [9, 5], [9, 6]],
  tired: [[3, 6], [4, 6], [9, 6], [10, 6], [4, 7], [9, 7]],
  asleep: [[3, 6], [4, 7], [5, 6], [8, 6], [9, 7], [10, 6]],
}

// Rendered size of the sprite at scale 1; the hero scales it to fit its spot.
export const PET_WIDTH = 120
export const PET_HEIGHT = (PET_WIDTH * SPRITE.length) / SPRITE[0].length

// The sprite alone. Inside a `group` wrapper, data-walking swaps the idle motion for a walk cycle and
// data-facing="left" mirrors it. `reading` swaps in the reading pose, which is always awake. `attacking` swings the
// sword over and over (animate-pet-swing, timed with the light wave it throws; see LinkSection).
export function PetSprite({
  mood,
  hopping,
  reading = false,
  attacking = false,
}: {
  mood: PetMood
  hopping: boolean
  reading?: boolean
  attacking?: boolean
}) {
  const sprite = reading ? READING_SPRITE : SPRITE
  return (
    <div className="relative group-data-[facing=left]:-scale-x-100">
      {mood === "asleep" && (
        <span aria-hidden="true" className="absolute -top-10 left-[52%] text-[15px] text-foreground">
          <span className="absolute animate-pet-z motion-reduce:animate-none">z</span>
          <span className="absolute -top-3 left-3 animate-pet-z text-[19px] [animation-delay:-1s] motion-reduce:animate-none">
            Z
          </span>
        </span>
      )}
      <svg
        viewBox={`0 0 ${sprite[0].length} ${sprite.length}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
        style={{ width: (PET_WIDTH * sprite[0].length) / SPRITE[0].length }}
        className={cn(
          "block overflow-visible group-data-walking:animate-pet-walk motion-reduce:animate-none",
          hopping ? "animate-pet-hop" : mood === "asleep" ? "animate-pet-breathe" : "animate-pet-bob",
        )}
      >
        {(reading ? readingPixels : attacking ? bodyPixels : spritePixels).map(({ x, y, fill }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className={fill} />
        ))}
        {attacking && !reading && (
          <g
            style={{ transformOrigin: SWORD_PIVOT }}
            className="animate-pet-swing [transform-box:view-box] motion-reduce:animate-none"
          >
            {swordPixels.map(({ x, y, fill }) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className={fill} />
            ))}
          </g>
        )}
        <g className={cn("fill-ink dark:fill-foreground", mood === "awake" && "animate-pet-blink [transform-box:fill-box] origin-center")}>
          {(reading ? readingEyes : eyes[mood]).map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
          ))}
        </g>
      </svg>
    </div>
  )
}

export type PetEnergy = ReturnType<typeof usePetEnergy>

// `onHomePage`: the first pet shown after a load or reload of the home page resets the energy to HOME_LOAD_LEVEL.
export function usePetEnergy({ onHomePage = false }: { onHomePage?: boolean } = {}) {
  const charge = parseCharge(useSyncExternalStore(subscribe, () => readStorage() ?? memoryCharge, () => null))
  const [now, setNow] = useState(() => Date.now())
  const [hopping, setHopping] = useState(false)

  useEffect(() => {
    const firstSinceLoad = !loadHandled
    loadHandled = true
    if (onHomePage && firstSinceLoad) writeCharge({ level: HOME_LOAD_LEVEL, at: Date.now() })
    // First visit: start the clock now.
    else if (!parseCharge(readStorage() ?? memoryCharge)) writeCharge({ level: 100, at: Date.now() })
  }, [onHomePage])

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
    if (energy < RECHARGE_LEVEL) writeCharge({ level: RECHARGE_LEVEL, at })
    setHopping(true)
  }

  return { energy, mood, hopping, recharge }
}

const ENERGY_BLOCKS = 10
// When the energy goes up (a recharge), the bar fills back one block per FILL_STEP_MS; when it drains, it drops at once.
const FILL_STEP_MS = 120
// A 3px pixel frame drawn by four offset shadows, which leave its corners notched; the margin keeps it in the box.
const pixelFrame =
  "mx-[3px] shadow-[0_-3px_var(--foreground),0_3px_var(--foreground),-3px_0_var(--foreground),3px_0_var(--foreground)]"

// Energy bar and recharge button, shown under the pet in the hero.
export function PetStatus({ energy, mood, recharge, className }: PetEnergy & { className?: string }) {
  const blocks = Math.ceil((energy / 100) * ENERGY_BLOCKS)
  const [filled, setFilled] = useState(blocks)
  if (blocks < filled) setFilled(blocks)

  useEffect(() => {
    if (filled >= blocks) return
    const timer = window.setTimeout(() => setFilled((count) => count + 1), FILL_STEP_MS)
    return () => window.clearTimeout(timer)
  }, [filled, blocks])

  return (
    <div className={cn("flex w-[200px] flex-col gap-3 bg-background max-phone:w-[170px]", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          {mood === "asleep" ? "Asleep" : "Energy"}
        </span>
        <span className="text-[15px] tabular-nums">{energy}%</span>
      </div>
      {/* A pixel frame around one block per started tenth */}
      <div
        role="meter"
        aria-label="Pet energy"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={energy}
        className={cn("flex gap-[3px] p-[3px]", pixelFrame)}
      >
        {Array.from({ length: ENERGY_BLOCKS }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-[9px] flex-1",
              index < filled
                ? mood === "awake"
                  ? "bg-foreground"
                  : "bg-destructive"
                : "bg-border",
            )}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={recharge}
        disabled={energy >= RECHARGE_LEVEL}
        className={cn(
          "mt-4 flex w-fit items-center self-center px-[18px] py-2 text-[13px] transition-colors duration-[250ms] hover:bg-highlight hover:text-ink active:translate-y-[3px] disabled:pointer-events-none disabled:opacity-40 max-phone:self-start",
          pixelFrame,
        )}
      >
        Recharge
      </button>
    </div>
  )
}

const READING_WIDTH = (PET_WIDTH * READING_SPRITE[0].length) / SPRITE[0].length

// The pet reading a book beside a page title, scaled to `height`. Away from the home page it never tires;
// clicking it still recharges it.
export function TitlePet({ height, className }: { height: number; className?: string }) {
  const { hopping, recharge } = usePetEnergy()
  const scale = height / PET_HEIGHT
  return (
    <button
      type="button"
      onClick={recharge}
      aria-label="Recharge the pet"
      style={{ width: READING_WIDTH * scale, height }}
      className={cn("relative flex-none", className)}
    >
      <span className="absolute top-0 left-0 origin-top-left" style={{ scale }}>
        <PetSprite mood="awake" hopping={hopping} reading />
      </span>
    </button>
  )
}

// The pet's body alone, without its sword, legs or motion: the mark at the start of the site header.
// Stateless on purpose: calling usePetEnergy here would claim the home page's wake-up on load.
const iconPixels = bodyPixels.filter(({ y }) => y < SPRITE.length - 1)

export function PetIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SWORD_X} ${SPRITE.length - 1}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("h-full w-auto flex-none", className)}
    >
      {iconPixels.map(({ x, y, fill }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className={fill} />
      ))}
      {eyes.awake.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className="fill-ink dark:fill-foreground" />
      ))}
    </svg>
  )
}
