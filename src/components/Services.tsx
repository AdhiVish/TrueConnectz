import { AnimatePresence, motion } from "motion/react";
import { INDUSTRIES, SERVICES } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";
import { Reveal, SectionHead } from "./Reveal";

/** Four service cards. After an audience is picked in the hero, the other audience's cards fade back. */
export function ServiceCards() {
  const { audience, setTab } = useUI();
  return (
    <section id="services-cards" className="bg-beige py-[80px] md:py-[110px]">
      <div className="wrap">
        <SectionHead eyebrow="Four service verticals" lead="Choose the service that fits where you are today.">
          One partner. <em>Four</em> ways to grow.
        </SectionHead>
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const faded = audience !== null && s.f !== audience;
            return (
              <Reveal key={s.k} delay={i * 0.1} className="flex">
              <motion.article
                animate={{ opacity: faded ? 0.4 : 1, filter: faded ? "grayscale(.6)" : "grayscale(0)" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative flex w-full flex-col border border-line bg-white px-[30px] py-[38px] transition-shadow duration-500 hover:shadow-[0_24px_50px_rgba(176,116,8,0.16)]"
              >
                <span className="absolute top-0 left-0 h-[3px] w-0 bg-[image:var(--metal)] transition-[width] duration-500 group-hover:w-full" />
                <span className="text-sm font-medium tracking-[.2em] text-gold">0{i + 1}</span>
                <h3 className="mt-[18px] mb-3 text-[30px]">{s.k}</h3>
                <p className="flex-1 text-[15.5px] text-mut">{s.d}</p>
                <button
                  type="button"
                  className="btn mt-[26px] px-4 py-[13px] text-[11.5px]"
                  onClick={() => {
                    setTab(i);
                    goTo("services");
                  }}
                >
                  Learn more
                </button>
              </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section id="industries" className="py-[80px] md:py-[110px]">
      <div className="wrap">
        <SectionHead eyebrow="Industries we serve">
          Specialist hiring across <em>selected</em> industries
        </SectionHead>
        <Reveal className="grid grid-cols-2 border border-line bg-white lg:grid-cols-5">
          {INDUSTRIES.map((n, i) => (
            <div
              key={n}
              className="group relative overflow-hidden border-b border-line px-[26px] py-[46px] transition-colors duration-300 hover:bg-beige lg:border-r lg:border-b-0 lg:last:border-r-0 [&:nth-child(odd)]:border-r"
            >
              <span className="block font-h text-[44px] leading-none text-gold2 transition-transform duration-500 group-hover:-translate-y-1">0{i + 1}</span>
              <h3 className="mt-5 text-[24px]">{n}</h3>
              <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[image:var(--metal)] transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** Everything under each vertical: tabs with an animated underline and panes that slide in. */
export function ServiceTabs() {
  const { tab, setTab, setForm } = useUI();
  const s = SERVICES[tab];
  return (
    <section id="services" className="bg-beige py-[80px] md:py-[110px]">
      <div className="wrap">
        <SectionHead eyebrow="What we do">
          Everything under <em>each</em> vertical
        </SectionHead>
        <div role="tablist" className="mb-11 flex flex-wrap gap-1.5 border-b border-line">
          {SERVICES.map((x, i) => (
            <button
              key={x.s}
              role="tab"
              aria-selected={i === tab}
              type="button"
              onClick={() => setTab(i)}
              className={`relative -mb-px cursor-pointer border-0 bg-transparent px-[22px] py-4 text-[13px] font-medium tracking-[.1em] uppercase transition-colors ${
                i === tab ? "text-ink" : "text-mut hover:text-ink"
              }`}
            >
              {x.s}
              {i === tab && <motion.span layoutId="tab-line" className="absolute inset-x-0 bottom-0 h-[2px] bg-[image:var(--metal)]" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className="grid gap-14 md:grid-cols-2"
          >
            <div>
              <h3 className="mb-3.5 text-[36px]">{s.k}</h3>
              <p className="mb-[26px] text-mut">{s.pos}</p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setForm(tab);
                  goTo("contact");
                }}
              >
                {s.cta}
              </button>
              {s.N && <p className="mt-6 border-l-[3px] border-gold2 bg-white/70 px-5 py-4 text-sm text-mut">{s.N}</p>}
            </div>
            <div>
              {s.L.map(([h, items], k) => (
                <div key={h}>
                  <h4 className={`mb-3 text-[12px] font-semibold tracking-[.22em] text-gold uppercase ${k ? "mt-[26px]" : ""}`}>{h}</h4>
                  <ul className="list-none">
                    {items.map((t, j) => (
                      <motion.li
                        key={t}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (k * 4 + j) * 0.035 }}
                        className="relative border-b border-line py-[11px] pl-7 text-[15.5px] before:absolute before:top-[21px] before:left-0 before:h-px before:w-3.5 before:bg-gold2"
                      >
                        {t}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
