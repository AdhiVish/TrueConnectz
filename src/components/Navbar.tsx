import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { asset } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";

/** The guidance document's recommended navigation. Service links open that service's tab. */
const MENU: { label: string; id: string; tab?: number }[] = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "HR Recruitment", id: "services", tab: 0 },
  { label: "HR Consulting & Advisory", id: "services", tab: 1 },
  { label: "True Connectz Academy", id: "services", tab: 2 },
  { label: "Virtual HR Solutions", id: "services", tab: 3 },
  { label: "Industries We Serve", id: "industries" },
  { label: "Insights & Resources", id: "insights" },
  { label: "Contact Us", id: "contact" },
];

export function Navbar() {
  const { setTab } = useUI();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 30));

  const go = (m: (typeof MENU)[number]) => {
    if (m.tab !== undefined) setTab(m.tab);
    setOpen(false);
    goTo(m.id);
  };

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-line backdrop-blur-[12px] transition-[background-color,box-shadow] duration-500 ${
        scrolled ? "bg-white/95 shadow-[0_10px_30px_-20px_rgba(24,24,24,0.35)]" : "bg-white/85"
      }`}
    >
      <div className={`wrap flex items-center justify-between gap-5 transition-[height] duration-500 ${scrolled ? "h-[68px]" : "h-[84px]"}`}>
        <button type="button" onClick={() => go(MENU[0])} aria-label="True Connectz HR Services, home" className="shrink-0 cursor-pointer border-0 bg-transparent p-0">
          <img
            src={asset("brand/logo-gold.webp")}
            alt="True Connectz HR Services"
            width={900}
            height={886}
            className={`w-auto transition-[height] duration-500 ${scrolled ? "h-[54px]" : "h-[68px]"}`}
          />
        </button>

        <div className="hidden gap-[18px] text-[12px] tracking-[.03em] xl:flex">
          {MENU.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => go(m)}
              className="group relative cursor-pointer border-0 bg-transparent px-0 py-1.5 whitespace-nowrap text-[#4a4438] transition-colors hover:text-ink"
            >
              {m.label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold2 transition-[width] duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative grid size-11 cursor-pointer place-items-center border-0 bg-transparent xl:hidden"
        >
          <span className={`absolute h-[1.5px] w-6 bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
          <span className={`absolute h-[1.5px] w-6 bg-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`absolute h-[1.5px] w-6 bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden border-t border-line bg-white xl:hidden"
          >
            <div className="wrap flex flex-col py-4">
              {MENU.map((m, i) => (
                <motion.button
                  key={m.label}
                  type="button"
                  onClick={() => go(m)}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="cursor-pointer border-0 border-b border-line bg-transparent py-3 text-left text-[15px] text-ink last:border-b-0"
                >
                  {m.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
