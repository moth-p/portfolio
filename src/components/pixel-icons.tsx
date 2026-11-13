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
