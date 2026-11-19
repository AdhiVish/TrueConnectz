import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import type { Audience } from "@/data/site";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Shared page state: which service tab and which enquiry form are open, and
 * which audience ("I'm a Business" / "I'm an Individual") the visitor picked.
 * Buttons all over the page jump to a tab/form through this.
 */
type UI = {
  tab: number;
  setTab: (i: number) => void;
  form: number;
  setForm: (i: number) => void;
  audience: Audience | null;
  setAudience: (a: Audience) => void;
};
const Ctx = createContext<UI | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(0);
  const [audience, setAudience] = useState<Audience | null>(null);
  return <Ctx.Provider value={{ tab, setTab, form, setForm, audience, setAudience }}>{children}</Ctx.Provider>;
}

export function useUI() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI outside UIProvider");
  return v;
}

/** Smooth-scroll to a section id (through Lenis when it's running). */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.3 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function useMedia(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
}
