import { motion } from "motion/react";
import { BRAND_PROMISE, type Audience } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";

/** Points of the "connected network" graphic; the first one is the hub. */
const P: [number, number][] = [
  [260, 240], [110, 120], [200, 60], [360, 70], [440, 160], [420, 300], [330, 410],
  [170, 390], [70, 280], [260, 140], [140, 240], [380, 220], [260, 330],
];
const LINES: [number, number][] = [];
P.forEach((a, i) => P.forEach((b, j) => j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 175 && LINES.push([i, j])));

/** Gold threads draw themselves between people (nodes), then the nodes keep pulsing. */
function Network() {
  return (
    <svg viewBox="0 0 520 480" aria-hidden className="w-full max-w-[520px] justify-self-center md:justify-self-end">
      <defs>
        <linearGradient id="tc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c07818" />
          <stop offset=".45" stopColor="#f0a818" />
          <stop offset=".6" stopColor="#fff078" />
          <stop offset="1" stopColor="#d8a818" />
        </linearGradient>
        <radialGradient id="tc-glow">
          <stop offset="0" stopColor="#ffd830" stopOpacity=".45" />
          <stop offset="1" stopColor="#ffd830" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="240" r="210" fill="url(#tc-glow)" />
      {LINES.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={P[a][0]}
          y1={P[a][1]}
          x2={P[b][0]}
          y2={P[b][1]}
          stroke="#f0a818"
          strokeOpacity={0.7}
          strokeWidth={1.3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.4 + i * 0.08, ease: "easeInOut" }}
        />
      ))}
      {P.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === 0 ? 15 : 6.5}
          fill={i === 0 ? "url(#tc-gold)" : "#fff"}
          stroke={i === 0 ? "none" : "#e3a414"}
          strokeWidth={1.8}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.2 + i * 0.07 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <animate attributeName="r" values={i === 0 ? "15;17;15" : "6.5;8;6.5"} dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </motion.circle>
      ))}
    </svg>
  );
}

const HEAD = [
  ["Connecting", "Talent."],
  ["Strengthening", "Organisations."],
  ["Developing", "People."],
];

export function Hero() {
  const { setTab, setAudience } = useUI();
  const pick = (a: Audience) => {
    setAudience(a);
    setTab(a === "ind" ? 2 : 0);
    goTo("services-cards");
  };

  return (
    <header id="home" className="relative overflow-hidden bg-[linear-gradient(180deg,#fff,var(--b))] pt-[80px] pb-[100px] md:pt-[90px] md:pb-[110px]">
      <div className="wrap grid items-center gap-10 md:grid-cols-[1.15fr_.85fr]">
        <div>
          <motion.p className="eyebrow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            {BRAND_PROMISE}
          </motion.p>
          <h1 className="mt-[22px] mb-6 text-[clamp(44px,6.4vw,92px)]">
            {HEAD.map(([a, b], i) => (
              <span key={a} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.14, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {a} {i === 1 ? <em>{b}</em> : b}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="max-w-[520px] text-[19px] text-mut"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Recruitment, HR consulting, learning and outsourced HR support, all under one trusted partner.
          </motion.p>
          <motion.div
            className="mt-[38px] flex flex-wrap gap-3.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
          >
            <button type="button" className="btn" onClick={() => pick("biz")}>
              I'm a Business
            </button>
            <button type="button" className="btn btn-o" onClick={() => pick("ind")}>
              I'm an Individual / Student
            </button>
          </motion.div>
        </div>
        <Network />
      </div>
    </header>
  );
}
