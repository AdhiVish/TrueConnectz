import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown } from "lucide-react";
import { asset, SERVICES } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";
import { useIntroPhase } from "@/lib/intro";

/** The guidance document's navigation; the four service pages sit in one "Services" dropdown on desktop. */
const MAIN: { label: string; id: string }[] = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "Industries We Serve", id: "industries" },
  { label: "Insights & Resources", id: "insights" },
  { label: "Contact Us", id: "contact" },
];
const SERVICE_LINKS = ["HR Recruitment", "HR Consulting & Advisory", "True Connectz Academy", "Virtual HR Solutions"];

export function Navbar() {
  const { setTab } = useUI();
  const loading = useIntroPhase() === "loading";
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (y < 200 || y < prev - 4) setHidden(false);
    else if (y > prev + 4) setHidden(true);
  });

  const go = (id: string, tab?: number) => {
    if (tab !== undefined) setTab(tab);
    setOpen(false);
    setDrop(false);
    goTo(id);
  };

  return (
    <motion.nav
      initial={{ y: -120 }}
      animate={{ y: loading || (hidden && !open) ? -120 : 0 }}
      transition={{ duration: loading ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-[34px] z-50 px-3 md:top-[38px]"
    >
      <div
        className={`mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 rounded-full border px-4 py-2 transition-all duration-500 md:px-6 ${
          scrolled ? "border-hair bg-[#0b0a08]/80 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)] backdrop-blur-md" : "border-transparent bg-transparent"
        }`}
      >
        <button type="button" onClick={() => go("home")} aria-label="True Connectz HR Services, home" className="flex shrink-0 cursor-pointer items-center gap-3 border-0 bg-transparent p-0">
          <img src={asset("brand/emblem.webp")} alt="" width={760} height={525} className="h-9 w-auto md:h-10" />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="metal-text font-h text-[22px] font-semibold tracking-[.02em]">True Connectz</span>
            <span className="mt-1 text-[8.5px] tracking-[.42em] text-mut">HR SERVICES</span>
          </span>
        </button>

        <div className="hidden items-center gap-7 text-[13px] lg:flex">
          {MAIN.slice(0, 2).map((m) => (
            <NavBtn key={m.id} onClick={() => go(m.id)}>
              {m.label}
            </NavBtn>
          ))}
          <div className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
            <NavBtn onClick={() => setDrop((v) => !v)}>
              <span className="inline-flex items-center gap-1">
                Services <ChevronDown className={`size-3.5 transition-transform ${drop ? "rotate-180" : ""}`} />
              </span>
            </NavBtn>
            <AnimatePresence>
              {drop && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="glass absolute top-full left-1/2 mt-3 w-[300px] -translate-x-1/2 rounded-2xl bg-[#0f0d0a]/95 p-2"
                >
                  {SERVICES.map((s, i) => (
                    <button
                      key={s.k}
                      type="button"
                      onClick={() => go("services", i)}
                      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent px-3 py-3 text-left transition-colors hover:bg-white/5"
                    >
                      <span className="font-h text-lg text-gold">0{i + 1}</span>
                      <span>
                        <span className="block text-[13.5px] text-text">{SERVICE_LINKS[i]}</span>
                        <span className="block text-[11.5px] text-mut">{s.d}</span>
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {MAIN.slice(2).map((m) => (
            <NavBtn key={m.id} onClick={() => go(m.id)}>
              {m.label}
            </NavBtn>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="btn hidden px-5 py-3 text-[11px] sm:inline-flex" onClick={() => go("contact")}>
            Get in touch
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative grid size-11 cursor-pointer place-items-center rounded-full border border-hair bg-white/5 lg:hidden"
          >
            <span className={`absolute h-[1.5px] w-5 bg-text transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
            <span className={`absolute h-[1.5px] w-5 bg-text transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass mx-auto mt-2 max-h-[75svh] max-w-[1240px] overflow-y-auto rounded-3xl bg-[#0b0a08]/95 p-4 lg:hidden"
            data-lenis-prevent
          >
            {([...MAIN.slice(0, 2), ...SERVICE_LINKS.map((l, i) => ({ label: l, id: "services", tab: i })), ...MAIN.slice(2)] as { label: string; id: string; tab?: number }[]).map((m, i) => (
              <motion.button
                key={m.label}
                type="button"
                onClick={() => go(m.id, m.tab)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i }}
                className="flex w-full cursor-pointer items-baseline gap-3 border-0 border-b border-hair bg-transparent py-3.5 text-left font-h text-2xl text-text last:border-b-0"
              >
                <span className="font-t text-[11px] text-gold">0{i + 1}</span>
                {m.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group relative cursor-pointer border-0 bg-transparent px-0 py-2 whitespace-nowrap text-text/75 transition-colors hover:text-text">
      {children}
      <span className="absolute bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-[image:var(--metal)] transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
    </button>
  );
}
