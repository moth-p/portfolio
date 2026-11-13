import { cn } from "@/lib/utils"

// Pixel icons drawn in the pet's colours. The grids only hold the body ("b"); a one-cell outline is traced
// around it, so each grid is padded by a cell on every side.
type Cell = [number, number]
type Sprite = { body: Cell[]; outline: Cell[]; width: number; height: number }

function sprite(rows: string[]): Sprite {
  const filled = new Set<string>()
  const body: Cell[] = []
  rows.forEach((row, y) =>
    [...row].forEach((cell, x) => {
      if (cell === ".") return
      body.push([x + 1, y + 1])
      filled.add(`${x + 1},${y + 1}`)
    }),
  )
  const width = rows[0].length + 2
  const height = rows.length + 2
  const outline: Cell[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (filled.has(`${x},${y}`)) continue
      const touches = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some((at) => filled.has(at.join()))
      if (touches) outline.push([x, y])
    }
  }
  return { body, outline, width, height }
}

function Pixels({ cells, className }: { cells: Cell[]; className: string }) {
  return (
    <g className={className}>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
      ))}
    </g>
  )
}

// Dark outline on a highlight body, reversed in dark mode, like the pet.
function PixelIcon({ sprite: { body, outline, width, height }, className }: { sprite: Sprite; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("block h-auto w-full", className)}
    >
      <Pixels cells={outline} className="fill-ink dark:fill-foreground" />
      <Pixels cells={body} className="fill-highlight dark:fill-ink" />
    </svg>
  )
}

const cursor = sprite([
  "b.........",
  "bb........",
  "bbb.......",
  "bbbb......",
  "bbbbb.....",
  "bbbbbb....",
  "bbbbbbb...",
  "bbbbbbbb..",
  "bbbbbbbbb.",
  "bbbbbb....",
  "bbb.bb....",
  "bb..bbb...",
  "b....bb...",
  ".....bbb..",
  "......bb..",
])

// Two arrows chasing each other round a square loop.
const repeat = sprite([
  "............b.....",
  "............bb....",
  "bbbbbbbbbbbbbbb...",
  "bbbbbbbbbbbbbbb...",
  "bb..........bb....",
  "bb..........b.....",
  "bb................",
  "bb................",
  "bb..............bb",
  "bb..............bb",
  "................bb",
  "................bb",
  ".....b..........bb",
  "....bb..........bb",
  "...bbbbbbbbbbbbbbb",
  "...bbbbbbbbbbbbbbb",
  "....bb............",
  ".....b............",
])

export function PixelCursor({ className }: { className?: string }) {
  return <PixelIcon sprite={cursor} className={className} />
}

export function PixelRepeat({ className }: { className?: string }) {
  return <PixelIcon sprite={repeat} className={className} />
}

// The light wave the pet slashes from its sword: a crescent bulging toward where it flies (right).
const wave = sprite([
  "bb...",
  ".bb..",
  "..bb.",
  "..bbb",
  "..bbb",
  "..bbb",
  "..bb.",
  ".bb..",
  "bb...",
])

// Unlike the other icons it stays light in dark mode, so it reads as light either way.
export function PixelWave({ className }: { className?: string }) {
  const { body, outline, width, height } = wave
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("block h-auto w-full", className)}
    >
      <Pixels cells={outline} className="fill-ink dark:fill-foreground" />
      <Pixels cells={body} className="fill-highlight" />
    </svg>
  )
}

// Work flow step icons, one per step, all on the same 15-cell-wide grid so they share a pixel size.

// Project Scope: a magnifying glass.
const magnifier = sprite([
  "...bbbbb.......",
  "..bb...bb......",
  ".bb.....bb.....",
  "bb.......bb....",
  "bb.......bb....",
  "bb.......bb....",
  "bb.......bb....",
  ".bb.....bb.....",
  "..bb...bbb.....",
  "...bbbbbbbb....",
  ".........bbb...",
  "..........bbb..",
  "...........bbb.",
  "............bbb",
  ".............bb",
])

// References Collection: a framed picture of a sun over hills.
const picture = sprite([
  "bbbbbbbbbbbbbbb",
  "bb...........bb",
  "bb.......bb..bb",
  "bb.......bb..bb",
  "bb...........bb",
  "bb...b.......bb",
  "bb..bbb......bb",
  "bb.bbbbb..b..bb",
  "bbbbbbbbbbbbbbb",
  "bbbbbbbbbbbbbbb",
])

// Prototype: a gear.
const gear = sprite([
  "......bbb......",
  "..bb..bbb..bb..",
  "..bbbbbbbbbbb..",
  "...bbbbbbbbb...",
  "..bbbb...bbbb..",
  "..bbb.....bbb..",
  "bbbbb.....bbbbb",
  "bbbbb.....bbbbb",
  "bbbbb.....bbbbb",
  "..bbb.....bbb..",
  "..bbbb...bbbb..",
  "...bbbbbbbbb...",
  "..bbbbbbbbbbb..",
  "..bb..bbb..bb..",
  "......bbb......",
])

// MVP: a rocket lifting off.
const rocket = sprite([
  "......bbb......",
  ".....bbbbb.....",
  "....bbbbbbb....",
  "....bb...bb....",
  "....bb...bb....",
  "....bbbbbbb....",
  "....bbbbbbb....",
  "...bbbbbbbbb...",
  "..bbbbbbbbbbb..",
  "..bbb.bbb.bbb..",
  "..bb..b.b..bb..",
  "......b.b......",
])

// Tech Stack: three stacked layers.
const layers = sprite([
  "..bbbbbbbbbbb..",
  "..bbbbbbbbbbb..",
  "...............",
  ".bbbbbbbbbbbbb.",
  ".bbbbbbbbbbbbb.",
  "...............",
  "bbbbbbbbbbbbbbb",
  "bbbbbbbbbbbbbbb",
])

// Implementation Plan: a milestone flag.
const flag = sprite([
  "bb.............",
  "bbbbbbbbbbb....",
  "bbbbbbbbbbbbb..",
  "bbbbbbbbbbbbbbb",
  "bbbbbbbbbbbbb..",
  "bbbbbbbbbbb....",
  "bb.............",
  "bb.............",
  "bb.............",
  "bb.............",
  "bb.............",
  "bb.............",
])

export function PixelMagnifier({ className }: { className?: string }) {
  return <PixelIcon sprite={magnifier} className={className} />
}

export function PixelPicture({ className }: { className?: string }) {
  return <PixelIcon sprite={picture} className={className} />
}

export function PixelGear({ className }: { className?: string }) {
  return <PixelIcon sprite={gear} className={className} />
}

export function PixelRocket({ className }: { className?: string }) {
  return <PixelIcon sprite={rocket} className={className} />
}

export function PixelLayers({ className }: { className?: string }) {
  return <PixelIcon sprite={layers} className={className} />
}

export function PixelFlag({ className }: { className?: string }) {
  return <PixelIcon sprite={flag} className={className} />
}

// A 3×5 pixel font for numbers.
const digits: Record<string, string[]> = {
  "0": ["bbb", "b.b", "b.b", "b.b", "bbb"],
  "1": [".b.", "bb.", ".b.", ".b.", "bbb"],
  "2": ["bbb", "..b", "bbb", "b..", "bbb"],
  "3": ["bbb", "..b", "bbb", "..b", "bbb"],
  "4": ["b.b", "b.b", "bbb", "..b", "..b"],
  "5": ["bbb", "b..", "bbb", "..b", "bbb"],
  "6": ["bbb", "b..", "bbb", "b.b", "bbb"],
  "7": ["bbb", "..b", "..b", ".b.", ".b."],
  "8": ["bbb", "b.b", "bbb", "b.b", "bbb"],
  "9": ["bbb", "b.b", "bbb", "..b", "bbb"],
}

// A number set in the pixel font, a cell apart, in the icons' colours. The SVG fills its height.
export function PixelNumber({ value, className }: { value: string; className?: string }) {
  const glyphs = [...value].map((digit) => digits[digit]).filter(Boolean)
  const rows = digits["0"].map((_, y) => glyphs.map((glyph) => glyph[y]).join("."))
  return <PixelIcon sprite={sprite(rows)} className={cn("h-full w-auto", className)} />
}
