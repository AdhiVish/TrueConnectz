import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

const SECTIONS = [
  ["home", "Home"],
  ["services", "Services"],
  ["industries", "Industries"],
  ["why", "Why us"],
  ["process", "Process"],
  ["proof", "Results"],
  ["about", "About"],
  ["contact", "Contact"],
] as const;

/**
 * Desktop-only rail on the right edge (the browser scrollbar is hidden):
 * a hairline that fills with metallic gold as you scroll, one dot per section.
 * The current section's name shows beside it, hover shows the rest, click jumps.
 * Over the cream band (`data-rail-light`) it switches to dark ink.
 */
export function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState<string>("home");
  const [light, setLight] = useState(false);

  useEffect(() => {
    const pick = () => {
      const mid = window.innerHeight * 0.5;
      let cur = "home";
      for (const [id] of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) cur = id;
      }
      setActive(cur);
      let onLight = false;
      document.querySelectorAll<HTMLElement>("[data-rail-light]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) onLight = true;
      });
      setLight(onLight);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  const go = (id: string) => {
    const el = id === "home" ? null : document.getElementById(id);
    if (window.__lenis) window.__lenis.scrollTo(el ?? 0, { duration: 1.4, offset: el ? -90 : 0 });
    else if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ink = light ? "var(--ink)" : "var(--text)";
  const mute = light ? "rgba(24,24,24,0.45)" : "rgba(244,236,216,0.45)";
  const accent = light ? "var(--gold-ink)" : "var(--gold)";

  return (
    <nav aria-label="Sections" className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative flex flex-col gap-[18px]">
        <span
          aria-hidden
          className="absolute top-0 right-[3px] bottom-0 w-px transition-colors duration-300"
          style={{ background: light ? "rgba(24,24,24,0.15)" : "var(--hair)" }}
        >
          <motion.span className="absolute inset-0 origin-top bg-[image:var(--metal)]" style={{ scaleY: fill }} />
        </span>
        {SECTIONS.map(([id, label]) => {
          const on = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              aria-current={on ? "true" : undefined}
              className="group relative flex cursor-pointer items-center justify-end gap-3 border-0 bg-transparent p-0"
            >
              <span
                className={
                  "text-[11px] tracking-[.18em] uppercase transition-all duration-300 " +
                  (on ? "opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")
                }
                style={{ color: on ? ink : mute }}
              >
                {label}
              </span>
              <span
                className="relative block size-[7px] rounded-full border transition-all duration-300"
                style={{
                  borderColor: on ? accent : mute,
                  background: on ? accent : light ? "var(--cream)" : "var(--night)",
                  transform: on ? "scale(1.4)" : "none",
                  boxShadow: on ? "0 0 0 3px rgba(240,168,24,0.22)" : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
