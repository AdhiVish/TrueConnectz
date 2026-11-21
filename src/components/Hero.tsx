import { useEffect, useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Briefcase, GraduationCap } from "lucide-react";
import { asset, BRAND_PROMISE, SERVICES, type Audience } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";

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

/** The glowing tc emblem inside slowly turning rings, with the four services orbiting it. */
function Emblem() {
  const rx = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 22);
    rx.set(-((e.clientY - b.top) / b.height - 0.5) * 22);
  };
  return (
    <motion.div
      onMouseMove={move}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto aspect-square w-[min(84vw,410px)] lg:-mt-[90px] lg:mr-[80px]"
      style={{ perspective: 900 }}
    >
      {/* glow */}
      <div aria-hidden className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,216,48,0.35),rgba(240,168,24,0.08)_45%,transparent_70%)]" />
      {/* rings */}
      <div aria-hidden className="absolute inset-[4%] rounded-full border border-hair" style={{ animation: "spin-slow 60s linear infinite" }}>
        <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun shadow-[0_0_16px_4px_rgba(255,216,48,0.7)]" />
      </div>
      <div aria-hidden className="absolute inset-[16%] rounded-full border border-dashed border-gold/25" style={{ animation: "spin-rev 90s linear infinite" }} />
      {/* the four services orbit the emblem (each label counter-rotates to stay upright) */}
      {SERVICES.map((s, i) => {
        const a = (i / SERVICES.length) * 360 - 45;
        return (
          <div key={s.s} className="absolute inset-[9%]" style={{ animation: "spin-slow 60s linear infinite" }}>
            <div className="absolute top-1/2 left-1/2 h-0 w-1/2 origin-left" style={{ transform: `rotate(${a}deg)` }}>
              <div className="absolute top-0 right-0" style={{ transform: `translate(50%,-50%) rotate(${-a}deg)` }}>
                <span
                  className="glass block rounded-full bg-[#0b0a08]/70 px-3.5 py-1.5 text-[10.5px] font-medium tracking-[.14em] whitespace-nowrap text-text uppercase md:text-[11.5px]"
                  style={{ animation: "spin-rev 60s linear infinite" }}
                >
                  <span className="text-gold">0{i + 1}</span> {s.s}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {/* the emblem */}
      <motion.div className="absolute inset-[29%] grid place-items-center" style={{ rotateX: rx, rotateY: ry }}>
        <motion.img
          src={asset("brand/emblem.webp")}
          alt="True Connectz emblem"
          width={760}
          height={525}
          className="w-full drop-shadow-[0_20px_40px_rgba(240,168,24,0.35)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const pick = (a: Audience) => {
    setAudience(a);
    setTab(a === "ind" ? 2 : 0);
    goTo("services");
  };

  return (
    <header id="home" ref={ref} className="relative overflow-hidden pt-[140px] pb-[80px] md:min-h-svh md:pt-[150px]">
      <NetworkCanvas />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_20%,var(--night)_75%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" />

      <motion.div style={{ y, opacity: fade }} className="wrap relative">
        <div>
          <motion.p className="eyebrow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
            {BRAND_PROMISE}
          </motion.p>
          <h1 className="mt-6 text-[clamp(44px,6.2vw,96px)]">
            {HEAD.map(({ a, b }, i) => (
              <span key={a} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {a} <span className="metal-text pr-[0.05em] italic">{b}</span>
                </motion.span>
              </span>
            ))}
          </h1>
        </div>
        <div className="mt-8 grid items-center gap-12 lg:mt-2 lg:grid-cols-[1fr_auto] lg:gap-6">
          <div>
          <motion.p
            className="max-w-[520px] text-[18px] text-mut md:text-[19px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
          >
            Recruitment, HR consulting, learning and outsourced HR support, all under one trusted partner.
          </motion.p>

          {/* two audience paths */}
          <div className="mt-8 grid max-w-[560px] gap-3 sm:grid-cols-2">
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
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
          <Emblem />
        </div>
      </motion.div>
    </header>
  );
}
