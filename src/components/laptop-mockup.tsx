import Image from "next/image"

import { cn } from "@/lib/utils"

// A screen recording (or, without one, a screenshot) shown on a laptop, centred in (and as large as fits) its relative parent, whatever the parent's shape.
// The laptop is sized in its own width (cqw), so the bezel, hinge and base keep their proportions at any size:
// lid 86% wide with a 5:3 screen (the screenshots' shape), plus a 3% base, comes to about 1.77 times as wide as it is tall.
export function LaptopMockup({
  src,
  video,
  alt,
  sizes,
  preload,
  className,
  laptopClassName,
}: {
  src: string
  /** Muted, looping recording played on the screen; `src` is its poster until it can play */
  video?: string
  alt: string
  sizes: string
  preload?: boolean
  className?: string
  laptopClassName?: string
}) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center p-[7%] [container-type:size]", className)}>
      <div className={cn("w-[min(100cqw,calc(100cqh*1.77))] [container-type:inline-size]", laptopClassName)}>
        <div className="relative mx-auto w-[86%] rounded-t-[2.4cqw] bg-device px-[1.8cqw] pt-[2.2cqw] pb-[1.8cqw]">
          <span className="absolute top-[0.8cqw] left-1/2 size-[0.6cqw] -translate-x-1/2 rounded-full bg-muted-foreground/50" />
          <div className="relative aspect-[5/3] overflow-hidden bg-ink">
            {video ? (
              <video
                src={video}
                poster={src}
                autoPlay
                muted
                loop
                playsInline
                aria-label={alt || undefined}
                aria-hidden={!alt || undefined}
                className="absolute inset-0 size-full object-cover object-top"
              />
            ) : (
              <Image src={src} alt={alt} fill preload={preload} quality={85} sizes={sizes} className="object-cover object-top" />
            )}
          </div>
        </div>
        <div className="relative h-[3cqw] rounded-t-[0.4cqw] rounded-b-[1.8cqw] bg-device-body shadow-[0_2cqw_3cqw_-1.5cqw_rgb(0_0_0/0.45)]">
          <span className="absolute top-0 left-1/2 h-[1cqw] w-[14%] -translate-x-1/2 rounded-b-[1cqw] bg-muted-foreground/40" />
        </div>
      </div>
    </div>
  )
}
