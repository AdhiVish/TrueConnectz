import { useEffect } from "react";
import Lenis from "lenis";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Industries, ServiceCards, ServiceTabs } from "@/components/Services";
import { About, Insights, Proof, Steps, Why } from "@/components/Story";
import { Contact, FinalCTA, Footer, WhatsAppFab } from "@/components/Contact";

export default function App() {
  // smooth scrolling (off for people who ask for reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, autoRaf: true });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <>
      <div className="bg-ink px-3.5 py-2 text-center text-[12px] tracking-[.14em] text-[#f3e3b8] uppercase">
        Website design preview for True Connectz HR Services
      </div>
      <Navbar />
      <main>
        <Hero />
        <ServiceCards />
        <Industries />
        <ServiceTabs />
        <Why />
        <Steps />
        <Proof />
        <About />
        <Insights />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
