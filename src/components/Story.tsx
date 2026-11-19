import { useRef, type MouseEvent } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, Award, Compass, MapPinned, Network, Sprout, Wrench } from "lucide-react";
import { ABOUT_MV, POSTS, PROOF, STEPS, WHY } from "@/data/site";
import { Reveal, RiseHeading, SectionHead } from "./Reveal";

const WHY_ICONS = [MapPinned, Compass, Wrench, Network, Sprout];

/** Card with a soft gold light that follows the cursor. */
function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - b.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - b.top}px`);
  };
  return (
    <div onMouseMove={move} className={`group relative overflow-hidden rounded-[24px] border border-hair bg-panel ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(360px circle at var(--mx) var(--my), rgba(240,168,24,0.14), transparent 70%)" }}
      />
      {children}
    </div>
  );
}

/** Why True Connectz: a bento grid; the first reason takes the big tile. */
export function Why() {
  return (
    <section id="why" className="relative py-[100px] md:py-[140px]">
      <div className="wrap">
        <SectionHead eyebrow="Why True Connectz" parts={["Talent, HR systems and", { em: "workforce" }, "development"]} />
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {WHY.map((w, i) => {
            const Icon = WHY_ICONS[i];
            const big = i === 0;
            return (
              <Reveal key={w.h} delay={i * 0.08} className={big ? "md:row-span-2" : ""}>
                <GlowCard className={`flex h-full flex-col justify-between p-7 md:p-8 ${big ? "min-h-[300px] md:min-h-full" : "min-h-[200px]"}`}>
                  <div className="relative flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl border border-hair bg-gold/10 text-sun">
                      <Icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="font-h text-[20px] text-text/25">0{i + 1}</span>
                  </div>
                  <div className="relative mt-10">
                    <h3 className={big ? "text-[40px] md:text-[52px]" : "text-[28px]"}>{w.h}</h3>
                    <p className="mt-2 text-[15px] text-mut">{w.p}</p>
                  </div>
                  {big && (
                    <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-16 size-72 rounded-full border border-gold/20">
                      <div className="absolute inset-8 rounded-full border border-gold/15" />
                      <div className="absolute inset-16 rounded-full border border-gold/10" />
                    </div>
                  )}
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Step({ i, label, p }: { i: number; label: string; p: MotionValue<number> }) {
  const at = i / (STEPS.length - 1);
  const lit = useTransform(p, [at - 0.08, at], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.8, 1]);
  const bg = useTransform(lit, (v) => (v > 0.5 ? "var(--metal)" : "var(--panel)"));
  const color = useTransform(lit, (v) => (v > 0.5 ? "#181818" : "#a69d88"));
  const opacity = useTransform(lit, [0, 1], [0.4, 1]);
  return (
    <div className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
      <motion.b
        className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border border-gold/40 font-h text-[22px] font-semibold md:mb-5"
        style={{ scale, background: bg, color, boxShadow: useTransform(lit, (v) => `0 0 ${v * 34}px rgba(255,216,48,${v * 0.5})`) }}
      >
        {i + 1}
      </motion.b>
      <motion.span className="self-center text-[15px] text-text md:max-w-[140px]" style={{ opacity }}>
        {label}
      </motion.span>
    </div>
  );
}

/** Recruitment process: a gold line draws along the steps as you scroll, lighting each one. */
export function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section className="relative border-y border-hair bg-panel py-[100px] md:py-[140px]">
      <div className="wrap">
        <SectionHead eyebrow="How we work" parts={["A simple,", { em: "clear" }, "recruitment process"]} />
        <div ref={ref} className="relative grid gap-8 md:grid-cols-7 md:gap-2">
          {/* track + gold progress: vertical on phones, horizontal on desktop */}
          <div aria-hidden className="absolute top-0 bottom-0 left-[27px] w-px bg-hair md:top-[27px] md:right-[7%] md:bottom-auto md:left-[7%] md:h-px md:w-auto" />
          <motion.div
            aria-hidden
            className="absolute top-0 bottom-0 left-[27px] w-px origin-top bg-[image:var(--metal)] md:hidden"
            style={{ scaleY: line }}
          />
          <motion.div
            aria-hidden
            className="absolute top-[27px] right-[7%] left-[7%] hidden h-[2px] origin-left bg-[image:var(--metal)] shadow-[0_0_14px_rgba(255,216,48,0.6)] md:block"
            style={{ scaleX: line }}
          />
          {STEPS.map((s, i) => (
            <Step key={s} i={i} label={s} p={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <section id="proof" className="relative py-[100px] md:py-[140px]">
      <div className="wrap">
        <SectionHead
          eyebrow="Proof & credibility"
          parts={["Numbers and voices you can", { em: "trust" }]}
          lead="Placeholders for the client to fill in. Only verified figures, genuine testimonials and authorised logos will be shown."
        />
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((p, i) => (
            <Reveal key={p} delay={i * 0.08}>
              <GlowCard className="p-7 text-center">
                <strong className="metal-text block font-h text-[64px] leading-none font-medium">&mdash;</strong>
                <span className="relative mt-3 block text-[13px] tracking-[.06em] text-mut">{p}</span>
              </GlowCard>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <GlowCard className="p-10 text-center md:p-14">
            <span aria-hidden className="metal-text block font-h text-[90px] leading-[0.5]">&ldquo;</span>
            <p className="relative mx-auto mt-6 max-w-[760px] font-h text-[26px] leading-[1.4] text-text/80 italic md:text-[32px]">
              A genuine client testimonial goes here, with the client's name, role and permission to publish.
            </p>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}

/** About + Insights share the one warm cream band. */
export function AboutAndInsights() {
  return (
    <div className="on-cream relative bg-cream text-ink">
      <section id="about" className="py-[100px] md:py-[140px]">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <div>
            <Reveal y={16}>
              <p className="eyebrow">About us</p>
            </Reveal>
            <RiseHeading parts={["Four services, one", { em: "people" }, "partner"]} className="section-h2" />
            <Reveal delay={0.15}>
              <blockquote className="relative mt-10 border-l-2 border-amber pl-6 font-h text-[26px] leading-[1.45] italic md:text-[30px]">
                True Connectz HR Services partners with organisations to attract the right talent, strengthen HR practices, develop workplace
                capabilities and manage essential people operations.
              </blockquote>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-[17px] text-[#5e5545]">
              Through recruitment, HR consulting, True Connectz Academy and Virtual HR Solutions, we support businesses and individuals at
              different stages of workforce growth.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ABOUT_MV.map((m, i) => (
                <motion.div
                  key={m.h}
                  whileHover={{ y: -4 }}
                  className={`rounded-[20px] p-6 ${i === 0 ? "bg-ink text-text" : "bg-white shadow-[0_14px_30px_-22px_rgba(120,80,0,0.45)]"}`}
                >
                  <Award className={`mb-5 size-5 ${i === 0 ? "text-sun" : "text-amber"}`} strokeWidth={1.6} />
                  <h4 className={`mb-1.5 text-[11.5px] font-semibold tracking-[.22em] uppercase ${i === 0 ? "text-sun" : "text-gold-ink"}`}>{m.h}</h4>
                  <p className={`text-[14px] ${i === 0 ? "text-mut" : "text-[#6b6355]"}`}>{m.p}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="insights" className="border-t border-[#e9dcbc] py-[100px] md:py-[140px]">
        <div className="wrap">
          <div className="mb-14 max-w-[820px] md:mb-20">
            <Reveal y={16}>
              <p className="eyebrow">Insights &amp; resources</p>
            </Reveal>
            <RiseHeading parts={["Ideas for hiring, HR and", { em: "growth" }]} className="section-h2" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {POSTS.map((p, i) => (
              <Reveal key={p.h} delay={i * 0.1}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="group flex h-full flex-col rounded-[24px] bg-white p-7 shadow-[0_20px_40px_-30px_rgba(120,80,0,0.5)]"
                >
                  <div className="mb-10 flex items-center justify-between">
                    <span className="rounded-full bg-[#fbecc2] px-3 py-1 text-[10.5px] font-semibold tracking-[.2em] text-gold-ink uppercase">{p.tag}</span>
                    <ArrowUpRight className="size-5 text-[#b8ac94] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber" />
                  </div>
                  <h3 className="text-[30px]">{p.h}</h3>
                  <p className="mt-3 text-[14.5px] text-[#6b6355]">{p.p}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
