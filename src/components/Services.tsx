import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Building2, Cpu, HeartPulse, Hotel, Truck } from "lucide-react";
import { INDUSTRIES, SERVICES } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";
import { Reveal, SectionHead } from "./Reveal";

/** Gold ticker of the industries, running under the hero. */
export function IndustryTicker() {
  const row = [...INDUSTRIES, "Pan-India reach", "Domestic & international hiring"];
  return (
    <div className="relative overflow-hidden border-y border-hair bg-panel py-5" aria-hidden>
      <div className="marquee flex w-max gap-12">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-h text-[28px] whitespace-nowrap text-text/80 italic md:text-[34px]">
            {t}
            <span className="text-[18px] text-gold not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The four service verticals in one explorer: the verticals as big numbered rows
 * on the left, the chosen one's full detail sliding in on the right. If a visitor
 * picked "Business" or "Individual" in the hero, the verticals for the other
 * audience are dimmed.
 */
export function ServicesExplorer() {
  const { tab, setTab, setForm, audience } = useUI();
  const s = SERVICES[tab];
  return (
    <section id="services" className="relative py-[100px] md:py-[140px]">
      <div aria-hidden className="pointer-events-none absolute top-40 -left-40 size-[520px] rounded-full bg-gold/10 blur-[120px]" />
      <div className="wrap relative">
        <SectionHead
          eyebrow="Four service verticals"
          parts={["One partner.", { em: "Four" }, "ways to grow."]}
          lead="Choose the service that fits where you are today."
        />
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
          {/* the four verticals */}
          <div className="flex flex-col">
            {SERVICES.map((x, i) => {
              const on = i === tab;
              const dim = audience !== null && x.f !== audience;
              return (
                <Reveal key={x.k} delay={i * 0.08} y={24}>
                  <button
                    type="button"
                    onClick={() => setTab(i)}
                    aria-pressed={on}
                    className={`group relative flex w-full cursor-pointer items-center gap-6 overflow-hidden border-0 border-b border-hair bg-transparent py-6 text-left transition-opacity duration-500 md:py-7 ${
                      dim && !on ? "opacity-35" : "opacity-100"
                    }`}
                  >
                    {on && <motion.span layoutId="svc-glow" className="absolute inset-0 -z-0 bg-gradient-to-r from-gold/12 to-transparent" transition={{ duration: 0.5 }} />}
                    <span className={`relative font-h text-[44px] leading-none transition-colors md:text-[56px] ${on ? "metal-text" : "text-text/20 group-hover:text-text/45"}`}>
                      0{i + 1}
                    </span>
                    <span className="relative flex-1">
                      <span className={`block font-h text-[26px] leading-tight transition-colors md:text-[32px] ${on ? "text-text" : "text-text/55 group-hover:text-text/85"}`}>{x.k}</span>
                      <span className="mt-1 block text-[14px] text-mut">{x.d}</span>
                    </span>
                    <ArrowRight className={`relative size-5 shrink-0 transition-all duration-300 ${on ? "translate-x-0 text-gold opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`} />
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* detail panel */}
          <Reveal delay={0.2} className="relative">
            <div className="glass relative overflow-hidden rounded-[28px] p-7 md:p-10">
              <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-sun/15 blur-3xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <span className="text-[11px] tracking-[.3em] text-gold uppercase">Vertical 0{tab + 1}</span>
                  <h3 className="mt-3 mb-4 text-[36px] md:text-[44px]">{s.k}</h3>
                  <p className="mb-8 text-mut">{s.pos}</p>
                  <div className="grid gap-x-8 md:grid-cols-1">
                    {s.L.map(([h, items], k) => (
                      <div key={h} className={k ? "mt-7" : ""}>
                        <h4 className="mb-3 text-[11.5px] font-semibold tracking-[.24em] text-sun uppercase">{h}</h4>
                        <ul className={`grid list-none gap-x-6 ${items.length > 6 ? "sm:grid-cols-2" : ""}`}>
                          {items.map((t, j) => (
                            <motion.li
                              key={t}
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.12 + (k * 5 + j) * 0.03 }}
                              className="flex gap-3 border-b border-hair py-2.5 text-[14.5px] text-text/85"
                            >
                              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[image:var(--metal)]" />
                              {t}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {s.N && <p className="mt-7 rounded-xl border-l-2 border-gold bg-gold/[0.06] px-4 py-3 text-[13.5px] text-mut">{s.N}</p>}
                  <button
                    type="button"
                    className="btn mt-8"
                    onClick={() => {
                      setForm(tab);
                      goTo("contact");
                    }}
                  >
                    {s.cta} <ArrowRight className="size-4" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const ICONS = [Building2, Cpu, HeartPulse, Truck, Hotel];

/** Industries as tall panels; the hovered (or tapped) one widens and lights up. */
export function Industries() {
  const [open, setOpen] = useState(0);
  return (
    <section id="industries" className="relative py-[100px] md:py-[140px]">
      <div className="wrap">
        <SectionHead eyebrow="Industries we serve" parts={["Specialist hiring across", { em: "selected" }, "industries"]} />
        <Reveal className="flex flex-col gap-3 md:h-[440px] md:flex-row">
          {INDUSTRIES.map((n, i) => {
            const Icon = ICONS[i];
            const on = i === open;
            return (
              <motion.button
                key={n}
                type="button"
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                animate={{ flexGrow: on ? 2.4 : 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex min-h-[120px] basis-0 cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] border p-6 text-left md:min-h-0 ${
                  on ? "border-gold/50 bg-panel2" : "border-hair bg-panel"
                }`}
              >
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -bottom-10 size-64 rounded-full bg-sun/20 blur-3xl"
                  animate={{ opacity: on ? 1 : 0 }}
                />
                <span className={`relative font-h text-[48px] leading-none md:text-[64px] ${on ? "metal-text" : "text-text/20"}`}>0{i + 1}</span>
                <span className="relative">
                  <Icon className={`mb-4 size-7 transition-colors ${on ? "text-sun" : "text-text/40"}`} strokeWidth={1.4} />
                  <span className={`block font-h leading-tight transition-[font-size] duration-500 ${on ? "text-[26px] text-text md:text-[32px]" : "text-[22px] text-text/70 md:text-[19px]"} [overflow-wrap:anywhere] md:[hyphens:auto]`}>{n}</span>
                </span>
              </motion.button>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
