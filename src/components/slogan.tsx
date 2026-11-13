"use client";

import dynamic from "next/dynamic";

import { PET_HEIGHT, PET_WIDTH } from "@/components/pixel-pet";
import { cn } from "@/lib/utils";

// three.js only loads on the client, in its own chunk.
const MagicCube = dynamic(() => import("@/components/magic-cube"), {
  ssr: false,
});

export type SloganMotion =
  | "hidden"
  | "in-up"
  | "in-down"
  | "out-up"
  | "out-down";

const motionClass: Record<SloganMotion, string> = {
  hidden: "opacity-0",
  "in-up": "animate__animated animate__fadeInUp [--animate-duration:800ms]",
  "in-down": "animate__animated animate__fadeInDown",
  // Leaving downwards it clears quickly, so the work flow's entrance can start (see Workflow).
  "out-up": "animate__animated animate__fadeOutUp [--animate-duration:500ms]",
  "out-down": "animate__animated animate__fadeOutDown",
};

// Top to bottom: the first word, then the cube, then the second word.
const delay = (order: number) => ({ animationDelay: `${order * 120}ms` });

// Set like the footer's "good": serif italic in the highlight colour. On the light page the highlight barely
// shows, so there the words use the text colour.
const wordClass =
  "block px-[0.08em] font-serif text-[clamp(56px,8vw,128px)] leading-[0.9] font-normal whitespace-nowrap italic text-foreground transition-colors duration-700 dark:text-highlight max-phone:text-[clamp(50px,15vw,70px)]";
// A thin eight-armed star sitting on the oval line.
function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      className={cn("absolute -translate-1/2 text-muted-foreground/70", className)}
    >
      <path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2 4.2 19.8" />
    </svg>
  );
}

export function Slogan({
  motion,
  active,
  progress,
}: {
  motion: SloganMotion;
  active: boolean;
  /** How far the cube has solved itself, 0 to 1, following the scroll */
  progress: number;
}) {
  return (
    <div className="flex h-svh flex-col items-center justify-center px-gutter">
      <span style={delay(0)} className={cn(wordClass, motionClass[motion])}>
        Solution
      </span>

      <div
        style={delay(1)}
        className={cn(
          "relative my-[clamp(4px,1.5vh,18px)] size-[clamp(200px,36vh,360px)] max-phone:size-[clamp(180px,30vh,250px)]",
          motionClass[motion],
        )}
      >
        {/* Decorative orbit: a tilted oval behind the cube with two stars on its line */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 h-[52%] w-[175%] -translate-1/2 -rotate-[12deg] rounded-[50%] border border-border max-phone:w-[150%]"
        >
          <Star className="top-[72%] left-[5%] size-[24px] max-phone:size-[19px]" />
          <Star className="top-[11.5%] left-[82%] size-[18px]" />
        </div>
        <div className="relative size-full">
          <MagicCube active={active} progress={progress} />
        </div>
        {/* The pet's spot, standing at the cube's right side; the pet itself is drawn by the hero */}
        <div
          id="slogan-pet-spot"
          style={{ aspectRatio: `${PET_WIDTH} / ${PET_HEIGHT}` }}
          className="absolute bottom-[-12%] left-[calc(100%+clamp(44px,8vw,120px))] w-[clamp(64px,7vw,100px)] max-phone:bottom-[-8%] max-phone:left-[calc(100%+8px)] max-phone:w-[52px]"
        />
      </div>

      <span style={delay(2)} className={cn(wordClass, motionClass[motion])}>
        Provider
      </span>
    </div>
  );
}
