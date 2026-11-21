import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { asset } from "@/data/site";
import { intro, useIntroPhase } from "@/lib/intro";

const EASE = [0.16, 1, 0.3, 1] as const;
const WORD = "TRUE CONNECTZ";

/**
 * Opening loader built from the logo itself: the "t" and the "c" slide in from
 * opposite sides and meet in the handshake, a gold pulse goes out from the
 * hands, a sheen runs over the emblem and the wordmark writes itself while the
 * underline fills with the real loading progress. Then the loader fades and
 * its emblem turns into the hero's gold particles (see Hero.tsx).
 * Full length on the first visit, a shorter cut on later visits in the same tab.
 */
export function Loader() {
  const phase = useIntroPhase();
  const [gone, setGone] = useState(false);
  const [pct, setPct] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  // first visit in this tab plays the full sequence, later reloads a quicker one
  const [k] = useState(() => {
    try {
      const seen = sessionStorage.getItem("tc-intro");
      sessionStorage.setItem("tc-intro", "1");
      return seen ? 0.6 : 1;
    } catch {
      return 1;
    }
  });
  const s = (sec: number) => sec * k; // timeline seconds, scaled

  useEffect(() => {
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      intro.set({ phase: "done" });
      setGone(true);
      return;
    }
    html.style.overflow = "hidden"; // no scrolling behind the loader (touch included)
    window.scrollTo(0, 0);

    const minMs = 2700 * k;
    const t0 = performance.now();
    let ready = false;
    const loaded = new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true })));
    Promise.race([Promise.all([loaded, document.fonts?.ready]), new Promise((r) => setTimeout(r, 6000))]).then(() => (ready = true));

    // progress: time-based, but it waits at 90% until the page has really loaded
    let raf = 0;
    let handed = false;
    const tick = () => {
      const t = (performance.now() - t0) / minMs;
      const p = Math.min(ready ? 1 : 0.9, t);
      setPct(Math.round(p * 100));
      if (p >= 1 && !handed) {
        handed = true;
        intro.set({ phase: "reveal", rect: box.current?.getBoundingClientRect() ?? null });
        setTimeout(() => {
          html.style.overflow = "";
          intro.set({ phase: "done" });
        }, 900);
        setTimeout(() => setGone(true), 1100);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      html.style.overflow = "";
    };
  }, [k]);

  if (gone) return null;
  const out = phase !== "loading";

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[200] grid place-items-center overflow-hidden"
      animate={{ opacity: out ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut", delay: out ? 0.15 : 0 }}
      style={{ pointerEvents: out ? "none" : "auto" }}
    >
      {/* backdrop: the page colour with a warm light in the middle */}
      <motion.div
        className="absolute inset-0 bg-night"
        animate={{ opacity: out ? 0 : 1 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 size-[110vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,168,24,0.16),rgba(240,168,24,0.04)_30%,transparent_55%)]"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: out ? 0 : 1, scale: 1 }}
        transition={{ duration: s(1.6), ease: EASE }}
      />

      <div className="relative flex flex-col items-center">
        {/* the emblem, assembled from its two halves */}
        <motion.div
          ref={box}
          className="relative aspect-[760/525] w-[min(58vw,280px)]"
          animate={out ? { opacity: 0 } : { scale: [1, 1, 1.06, 1] }}
          transition={out ? { duration: 0.45, ease: "easeOut" } : { duration: s(0.7), delay: s(0.95), times: [0, 0.01, 0.35, 1], ease: "easeOut" }}
        >
          <motion.img
            src={asset("brand/emblem-t.webp")}
            alt=""
            className="absolute inset-0 size-full"
            initial={{ x: "-62vw", rotate: -14, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: s(1), delay: s(0.1), ease: EASE }}
          />
          <motion.img
            src={asset("brand/emblem-c.webp")}
            alt=""
            className="absolute inset-0 size-full"
            initial={{ x: "62vw", rotate: 14, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: s(1), delay: s(0.1), ease: EASE }}
          />
          {/* once they meet, the untouched emblem takes over (no seams) */}
          <motion.img
            src={asset("brand/emblem.webp")}
            alt=""
            className="absolute inset-0 size-full drop-shadow-[0_18px_40px_rgba(240,168,24,0.35)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: s(1.02) }}
          />
          {/* sheen across the metal, clipped to the emblem's shape */}
          <div className="loader-mask absolute inset-0 overflow-hidden" style={{ ["--m" as string]: `url(${asset("brand/emblem.webp")})` }}>
            <motion.div
              className="absolute inset-y-0 w-1/2 bg-[linear-gradient(100deg,transparent,rgba(255,255,240,0.85),transparent)]"
              initial={{ x: "-120%" }}
              animate={{ x: "320%" }}
              transition={{ duration: s(0.9), delay: s(1.15), ease: "easeInOut" }}
            />
          </div>
          {/* the handshake: a ring of light goes out from the hands */}
          {[0, 0.12].map((d) => (
            <motion.span
              key={d}
              className="absolute top-[47%] left-[42%] size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sun"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 9], opacity: [0, 0.9, 0] }}
              transition={{ duration: s(1.1), delay: s(1.0 + d), times: [0, 0.15, 1], ease: "easeOut" }}
            />
          ))}
          <motion.span
            className="absolute top-[47%] left-[42%] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,240,120,0.95),rgba(255,216,48,0.35)_35%,transparent_70%)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 2.2], opacity: [0, 1, 0] }}
            transition={{ duration: s(0.7), delay: s(0.98), ease: "easeOut" }}
          />
        </motion.div>

        {/* wordmark, letter by letter */}
        <motion.div
          className="mt-9 flex flex-col items-center"
          animate={out ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="flex overflow-hidden font-t text-[17px] font-semibold tracking-[.42em] md:text-[20px]">
            {WORD.split("").map((ch, i) => (
              <motion.span
                key={i}
                className="metal-text inline-block"
                style={{ animation: "none" }}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: s(0.7), delay: s(1.2 + i * 0.035), ease: EASE }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </div>
          <motion.span
            className="mt-2 text-[9.5px] tracking-[.6em] text-mut"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: s(0.8), delay: s(1.6) }}
          >
            HR SERVICES
          </motion.span>
          {/* the logo's underline doubles as the progress bar */}
          <div className="mt-5 h-px w-[min(64vw,300px)] bg-white/10">
            <div className="h-full origin-left bg-[image:var(--metal)]" style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
        </motion.div>
      </div>

      {/* counter, bottom corner */}
      <motion.span
        className="absolute right-6 bottom-6 font-h text-[44px] leading-none text-gold/80 tabular-nums md:right-10 md:bottom-8 md:text-[64px]"
        animate={{ opacity: out ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {String(pct).padStart(3, "0")}
      </motion.span>
      <motion.span
        className="absolute bottom-7 left-6 text-[10px] tracking-[.32em] text-mut uppercase md:bottom-10 md:left-10"
        animate={{ opacity: out ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        Connecting Talent
      </motion.span>
    </motion.div>
  );
}
