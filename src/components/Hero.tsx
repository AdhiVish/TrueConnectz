import { useEffect, useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Briefcase, GraduationCap } from "lucide-react";
import { asset, BRAND_PROMISE, SERVICES, type Audience } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";
import { useIntroPhase } from "@/lib/intro";
import { PARALLAX, ParticleEmblem } from "@/components/ParticleEmblem";

/**
 * Live gold network in the background: points drift slowly and link up when
 * they come near each other (people connecting). Points near the cursor are
 * drawn towards it. Pauses when the hero is off screen.
 */
function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const mouse = { x: -9999, y: -9999 };
    let pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const resize = () => {
      w = c.offsetWidth;
      h = c.offsetHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const onMove = (e: PointerEvent) => {
      const b = c.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(c);
    const LINK = 140;
    const root = document.documentElement;
    function draw() {
      raf = 0;
      // hold the picture while the page is scrolling: no redraw = lighter scroll frames
      if (root.classList.contains("lenis-scrolling")) {
        if (visible && !still) raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!still) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 180) {
            p.vx += (dx / d) * 0.012;
            p.vy += (dy / d) * 0.012;
          }
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.vx += (Math.random() - 0.5) * 0.01;
          p.vy += (Math.random() - 0.5) * 0.01;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(240,168,24,${(1 - d / LINK) * 0.28})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const near = Math.hypot(mouse.x - p.x, mouse.y - p.y) < 160;
        ctx.fillStyle = near ? "rgba(255,240,120,0.95)" : "rgba(255,216,48,0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r + 1 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible && !still) raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The four services orbit the emblem on a tilted ellipse: chips at the front
 * (bottom) are bigger and brighter, chips at the back smaller and dimmer.
 */
function Orbit({ on }: { on: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const still = reduced();
    let raf = 0;
    let vis = true;
    let a = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(50, now - last);
      last = now;
      if (!still) a += dt * 0.00011;
      const b = box.current;
      if (!b) return;
      const W = b.offsetWidth, Hh = b.offsetHeight;
      const rx = Math.min(W * 0.6, window.innerWidth / 2 - 72);
      const ry = Hh * 0.6;
      chips.current.forEach((el, i) => {
        if (!el) return;
        const t = a + (i * Math.PI) / 2 - Math.PI / 4;
        const d = (Math.sin(t) + 1) / 2; // 0 = back, 1 = front
        el.style.transform = `translate(-50%,-50%) translate(${Math.cos(t) * rx}px,${Math.sin(t) * ry}px) scale(${0.8 + d * 0.25})`;
        el.style.opacity = String(0.4 + d * 0.6);
      });
      if (vis && !still) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting;
      if (vis && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(box.current!);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);
  return (
    <div ref={box} aria-hidden className="pointer-events-none absolute inset-0">
      <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 0.9 }} animate={on ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.6, delay: 0.5, ease: EASE }}>
        <div className="absolute -inset-x-[20%] -inset-y-[24%] rounded-[50%] border border-hair" />
        <div className="absolute -inset-x-[8%] -inset-y-[12%] rounded-[50%] border border-dashed border-gold/15" />
      </motion.div>
      {SERVICES.map((s, i) => (
        <div
          key={s.s}
          ref={(el) => {
            chips.current[i] = el;
          }}
          className="absolute top-1/2 left-1/2"
        >
          <motion.span
            className="glass block rounded-full bg-[#0b0a08]/75 px-3.5 py-1.5 text-[10.5px] font-medium tracking-[.14em] whitespace-nowrap text-text uppercase md:px-4 md:py-2 md:text-[12px]"
            initial={{ opacity: 0 }}
            animate={on ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 1.1 + i * 0.12 }}
          >
            <span className="text-gold">0{i + 1}</span> {s.s}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

const HEAD = [
  { a: "Connecting", b: "Talent." },
  { a: "Strengthening", b: "Organisations." },
  { a: "Developing", b: "People." },
];

export function Hero() {
  const { setTab, setAudience } = useUI();
  const ref = useRef<HTMLElement>(null);
  const top = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const on = useIntroPhase() !== "loading";
  const still = reduced();
  const { scrollYProgress } = useScroll({ target: top, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, PARALLAX]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // a soft gold light follows the cursor across the hero
  const lx = useSpring(useMotionValue(-700), { stiffness: 60, damping: 20 });
  const ly = useSpring(useMotionValue(-700), { stiffness: 60, damping: 20 });
  const light = (e: MouseEvent<HTMLElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    lx.set(e.clientX - b.left - 400);
    ly.set(e.clientY - b.top - 400);
  };

  const pick = (a: Audience) => {
    setAudience(a);
    setTab(a === "ind" ? 2 : 0);
    goTo("services");
  };

  const d0 = 0.25; // first-screen text starts this long after the loader hands over
  const inView = { once: true, amount: 0.35 } as const;

  return (
    <header id="home" ref={ref} onMouseMove={light} className="relative overflow-hidden">
      <NetworkCanvas />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 hidden size-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,216,48,0.08),transparent_60%)] [@media(hover:hover)]:block"
        style={{ x: lx, y: ly }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,transparent_15%,var(--night)_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" />

      {/* first screen: the emblem, big and centred */}
      <section ref={top} className="relative flex min-h-svh flex-col items-center justify-center px-4 pt-[120px] pb-[120px] md:pt-[130px]">
        {!still && <ParticleEmblem hero={top} slot={slot} />}
        <motion.div style={{ y, opacity: fade }} className="relative flex w-full flex-col items-center">
          <motion.p
            className="eyebrow justify-center text-center !tracking-[.28em] before:hidden md:before:block"
            initial={{ opacity: 0, y: -10 }}
            animate={on ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: d0 + 0.9 }}
          >
            {BRAND_PROMISE}
          </motion.p>
          <div className="relative mt-16 w-[min(78vw,700px,calc((100svh-420px)*1.448))] md:mt-20">
            <div aria-hidden className="absolute -inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(255,216,48,0.16),rgba(240,168,24,0.05)_50%,transparent)]" />
            <Orbit on={on} />
            {/* the emblem's box (the dust lands here); people who turn motion off get the plain logo */}
            <div ref={slot} className="relative aspect-[760/525] w-full">
              {still && <img src={asset("brand/emblem.webp")} alt="" width={760} height={525} className="size-full" />}
            </div>
          </div>
          <motion.p
            className="mt-16 text-[10.5px] tracking-[.32em] text-mut uppercase md:mt-[72px]"
            initial={{ opacity: 0 }}
            animate={on ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: d0 + 2 }}
          >
            <span className="hidden [@media(hover:hover)]:inline">Move through the logo · click it</span>
            <span className="[@media(hover:hover)]:hidden">Touch the logo · tap it</span>
          </motion.p>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          aria-hidden
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center"
          initial={{ opacity: 0 }}
          animate={on ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: d0 + 1.6 }}
        >
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <span className="cue-line absolute inset-0 bg-[image:var(--metal)]" />
          </span>
        </motion.div>
      </section>

      {/* then the message and the two ways in */}
      <div className="wrap relative pt-6 pb-[90px] md:pb-[120px]">
        {/* the trigger sits on the h1: each line starts hidden inside its own clip, so it can't trigger itself */}
        <motion.h1 className="text-[clamp(44px,6.4vw,100px)]" initial="hide" whileInView="show" viewport={inView}>
          {HEAD.map(({ a, b }, i) => (
            <span key={a} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block origin-left"
                variants={{ hide: { y: "110%", rotate: 4 }, show: { y: "0%", rotate: 0, transition: { duration: 1.2, delay: i * 0.12, ease: EASE } } }}
              >
                {a} <span className="metal-text pr-[0.05em] italic">{b}</span>
              </motion.span>
            </span>
          ))}
        </motion.h1>
        <div className="mt-10 grid items-end gap-8 lg:mt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <motion.p
            className="max-w-[520px] text-[18px] text-mut md:text-[20px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            Recruitment, HR consulting, learning and outsourced HR support, all under one trusted partner.
          </motion.p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["biz", "I'm a Business", "Hiring, HR systems and outsourced HR", Briefcase],
                ["ind", "I'm an Individual / Student", "Academy programmes and career readiness", GraduationCap],
              ] as const
            ).map(([a, label, sub, Icon], i) => (
              <motion.button
                key={a}
                type="button"
                onClick={() => pick(a)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.12, ease: EASE }}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl p-5 text-left transition-transform duration-300 hover:-translate-y-1 ${
                  i === 0 ? "bg-[image:var(--metal)] text-ink" : "glass text-text"
                }`}
              >
                <Icon className="mb-6 size-6" strokeWidth={1.6} />
                <span className="block text-[15px] font-semibold">{label}</span>
                <span className={`mt-1 block text-[13px] ${i === 0 ? "text-ink/70" : "text-mut"}`}>{sub}</span>
                <ArrowUpRight className="absolute top-5 right-5 size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
