import { FadeInUp } from "@/components/fade-in-up"


export function About() {
  return (
    <section
      id="about"
      className="grid-lines grid grid-cols-12 px-gutter py-[clamp(100px,13vw,190px)]"
    >
      <span className="col-span-2 mb-[18px] block pt-2.5 text-[11px] tracking-[0.12em] text-muted-foreground max-tab:col-span-12">
        02
      </span>
      <FadeInUp as="p" className="col-start-3 col-end-11 text-[clamp(38px,5vw,74px)] leading-[1.08] tracking-[-0.045em] max-tab:col-span-12">
        Good design should feel{" "}
        <em className="rounded-full bg-highlight px-[0.07em] font-medium">obvious</em> in hindsight. I
        bring strategy, identity, and interaction together to get there.
      </FadeInUp>
      <div className="col-start-9 col-end-13 mt-20 border-t border-border pt-[15px] max-tab:col-start-5 max-phone:col-start-2">
        <span className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Capabilities</span>
        <p className="mt-[30px] text-sm leading-[1.55]">
          Brand systems, digital products, creative direction, and frontend collaboration.
        </p>
      </div>
    </section>
  )
}
