import { FadeInUp } from "@/components/fade-in-up"
import { ArrowIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid-lines relative grid min-h-[min(780px,calc(100vh-88px))] grid-cols-12 overflow-hidden border-b border-border px-gutter max-tab:min-h-[690px] max-phone:min-h-[calc(100svh-72px)]"
    >
      <div className="col-span-12 flex justify-between pt-[clamp(38px,7vh,72px)] text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
        <span>Independent designer</span>
        <span className="max-tab:hidden">Based in Amsterdam</span>
      </div>
      <FadeInUp
        as="h1"
        id="hero-title"
        className="z-[2] col-span-10 mt-[clamp(52px,8vh,100px)] mb-11 max-w-[900px] self-center text-[clamp(58px,8.1vw,124px)] leading-[0.89] font-medium  max-tab:col-span-12 max-tab:mt-[70px] max-tab:self-start max-phone:text-[clamp(48px,15.5vw,70px)]"
      >
        Shape ideas into digital
        experiences.
      </FadeInUp>
      <div className="z-[2] col-span-6 flex items-end justify-between self-end pb-12 max-tab:col-span-11 max-phone:col-span-12 max-phone:gap-[25px]">
        <p className="max-w-[390px] text-[clamp(16px,1.4vw,20px)] leading-normal text-muted-foreground">
          Brand and product designer partnering with thoughtful people to make useful, lasting things.
        </p>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="size-14 flex-none rotate-90 rounded-full border-border bg-background shadow-none duration-[220ms] hover:scale-106 hover:bg-foreground hover:text-background dark:border-border dark:bg-background dark:hover:bg-foreground"
        >
          <a href="#work" aria-label="See selected work">
            <ArrowIcon />
          </a>
        </Button>
      </div>
      <div
        aria-hidden="true"
        className="absolute right-[clamp(18px,5vw,90px)] -bottom-20 aspect-square w-[clamp(230px,28vw,420px)] rounded-full border border-border max-tab:-right-[110px] max-tab:-bottom-10"
      >
        <div className="absolute top-1/2 -left-[12%] h-px w-[124%] -rotate-[35deg] bg-border" />
        <div className="absolute top-[16%] right-[11%] size-6 rounded-full bg-highlight" />
        <span className="absolute top-[30%] left-1/4 -rotate-[35deg] text-[9px] tracking-[0.14em] text-muted-foreground">
          FORM / FUNCTION / FEELING
        </span>
      </div>
    </section>
  )
}
