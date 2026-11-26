import { useEffect } from "react";
import Lenis from "lenis";
import { startAnimPauser } from "@/lib/perf";
import { intro } from "@/lib/intro";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { IndustryTicker, Industries, ServicesExplorer } from "@/components/Services";
import { AboutAndInsights, Proof, Steps, Why } from "@/components/Story";
import { Contact, FinalCTA, Footer, WhatsAppFab } from "@/components/Contact";
import { ScrollRail } from "@/components/ScrollRail";

export default function App() {
  // smooth scrolling (off for people who ask for reduced motion)
  useEffect(() => startAnimPauser(), []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, autoRaf: true });
    window.__lenis = lenis;
    // hold the page still while the loader is up
    const sync = () => (intro.get().phase === "loading" ? lenis.stop() : lenis.start());
    sync();
    const unsub = intro.sub(sync);
    return () => {
      unsub();
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <div className="grain relative">
      <Loader />
      <div className="relative z-[51] bg-[image:var(--metal)] px-3.5 py-2 text-center text-[11px] font-semibold tracking-[.18em] text-ink uppercase">
        <span className="hidden sm:inline">Website design preview for True Connectz HR Services</span>
        <span className="sm:hidden">Design preview · True Connectz</span>
      </div>
      <Navbar />
      <ScrollRail />
      <main>
        <Hero />
        <IndustryTicker />
        <ServicesExplorer />
        <Industries />
        <Why />
        <Steps />
        <Proof />
        <AboutAndInsights />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
