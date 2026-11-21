import { useEffect, useRef, type RefObject } from "react";
import { asset } from "@/data/site";
import { intro } from "@/lib/intro";

/** Logo golds, darkest to brightest; the last one is the "lit" colour. */
const GOLDS = ["#8a5604", "#b06c10", "#d8901a", "#f0a818", "#ffc828", "#ffe25a", "#fff6b0"];
const LIT = GOLDS.length - 1;
const HAND = { u: 0.42, v: 0.47 }; // where the two hands meet, in emblem coordinates

type P = {
  u: number; v: number; // position inside the emblem, 0..1
  x: number; y: number; vx: number; vy: number;
  c: number; // colour bucket
  dx: number; dy: number; r: number; // scatter direction + randomness (scroll-away)
  rel: number; // release time for the intro, seconds
};

/**
 * The tc emblem made of gold dust. It takes over from the loader's emblem (same
 * spot, same size) and flies into `slot`. The dust scatters away from the
 * cursor or a finger and settles back, a "connection" pulse runs out from the
 * handshake every few seconds, a click/tap bursts it, and it drifts apart as
 * the hero scrolls away. Drawn on one canvas covering `hero`; it stops drawing
 * when the hero is off screen.
 */
/** How far (px) the hero content drifts down while the hero scrolls away; the dust follows it. */
export const PARALLAX = 160;

export function ParticleEmblem({ hero, slot }: { hero: RefObject<HTMLElement | null>; slot: RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const H = hero.current!;
    const S = slot.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const small = window.matchMedia("(max-width: 767px)").matches;
    const SW = small ? 150 : 200; // sampling width: the emblem becomes ~SW x 0.69*SW dots before thinning

    let pts: P[] = [];
    let w = 0, h = 0; // canvas size (css px)
    let sx = 0, sy = 0, ew = 0, eh = 0; // emblem box inside the canvas
    let heroTop = 0, heroH = 1, vh = 800;
    let dot = 2;
    let started = false; // particles have been placed
    let t0 = 0; // intro start (s)
    const mouse = { x: -9999, y: -9999 };
    const lists: number[][] = GOLDS.map(() => []);

    const layout = () => {
      w = H.offsetWidth;
      h = H.offsetHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // layout position (ignores transforms like the hero's entrance + parallax)
      let x = 0, y = 0;
      for (let el: HTMLElement | null = S; el && el !== H; el = el.offsetParent as HTMLElement | null) {
        x += el.offsetLeft;
        y += el.offsetTop;
      }
      sx = x;
      sy = y;
      ew = S.offsetWidth;
      eh = S.offsetHeight;
      heroTop = H.getBoundingClientRect().top + window.scrollY;
      heroH = h;
      vh = window.innerHeight;
      dot = Math.max(1.2, (ew / SW) * 0.95);
    };

    // sample the emblem image into dots
    const img = new Image();
    img.src = asset("brand/emblem.webp");
    const sample = () => {
      const sh = Math.round((SW * img.naturalHeight) / img.naturalWidth);
      const oc = document.createElement("canvas");
      oc.width = SW;
      oc.height = sh;
      const o = oc.getContext("2d", { willReadFrequently: true })!;
      o.drawImage(img, 0, 0, SW, sh);
      const d = o.getImageData(0, 0, SW, sh).data;
      const out: P[] = [];
      for (let y = 0; y < sh; y++)
        for (let x = 0; x < SW; x++) {
          const i = (y * SW + x) * 4;
          if (d[i + 3] < 140) continue;
          const lum = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255;
          const a = Math.random() * Math.PI * 2;
          out.push({
            u: (x + 0.5 + (Math.random() - 0.5) * 0.3) / SW,
            v: (y + 0.5 + (Math.random() - 0.5) * 0.3) / sh,
            x: 0, y: 0, vx: 0, vy: 0,
            c: Math.max(0, Math.min(LIT - 1, Math.floor((lum - 0.35) * 10))),
            dx: Math.cos(a), dy: Math.sin(a), r: Math.random(),
            rel: 0,
          });
        }
      // thin out evenly to a budget
      const max = small ? 3400 : 6500;
      pts = out.length > max ? out.filter(() => Math.random() < max / out.length) : out;
    };

    const tx = (p: P) => sx + p.u * ew;
    const ty = (p: P) => sy + p.v * eh;

    /** Put the dust where the loader's emblem was, then let it fly home. */
    const place = () => {
      if (!pts.length || started) return;
      const st = intro.get();
      if (st.phase === "loading") return;
      started = true;
      t0 = performance.now() / 1000;
      const hb = H.getBoundingClientRect();
      const r = st.rect;
      for (const p of pts) {
        if (r && st.phase === "reveal") {
          p.x = r.left - hb.left + p.u * r.width;
          p.y = r.top - hb.top + p.v * r.height;
          // released in a sweep from the handshake outwards, with an outward swirl
          const ox = p.x - (r.left - hb.left + HAND.u * r.width);
          const oy = p.y - (r.top - hb.top + HAND.v * r.height);
          const d = Math.hypot(ox, oy) || 1;
          p.rel = 0.18 + (d / r.width) * 0.35 + Math.random() * 0.25;
          const f = 2 + Math.random() * 5;
          p.vx = (ox / d) * f - (oy / d) * f * 0.6;
          p.vy = (oy / d) * f + (ox / d) * f * 0.6;
        } else {
          p.x = tx(p); // already home
          p.y = ty(p);
          p.rel = 0;
        }
      }
    };

    let raf = 0;
    let visible = true;
    let pulseAt = 1.6;
    const loop = () => {
      raf = 0;
      if (!visible) return;
      const now = performance.now() / 1000;
      ctx.clearRect(0, 0, w, h);
      if (started) {
        const t = now - t0;
        // scroll-away: 0 at the top of the page, 1 once the hero has scrolled off
        const prog = Math.max(0, Math.min(1, (window.scrollY - heroTop) / heroH));
        // the dust starts drifting apart once the emblem itself nears the top of the screen
        const from = Math.max(0, sy - vh * 0.35);
        const sp = Math.max(0, Math.min(1, (window.scrollY - heroTop - from) / (vh * 0.7)));
        const par = prog * PARALLAX;
        const fly = t < 2.2; // looser springs while the dust is flying in
        const k = fly ? 0.035 : 0.06;
        const damp = fly ? 0.9 : 0.84;
        // connection pulse from the handshake
        if (t > pulseAt + 2.4) pulseAt = t + 2.5 + Math.random() * 2;
        const pr = (t - pulseAt) * ew * 0.9;
        const hx = sx + HAND.u * ew, hy = sy + HAND.v * eh;
        const R = small ? 60 : 95;
        for (const l of lists) l.length = 0;

        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (t < p.rel) {
            // still held where the loader's emblem was
            lists[p.c].push(i);
            continue;
          }
          const e = sp > 0 ? Math.pow(sp, 1.4) * (0.4 + p.r) : 0;
          const gx = tx(p) + p.dx * e * 600;
          const gy = ty(p) + par + p.dy * e * 600 - e * 160 + Math.sin(now * 1.3 + p.u * 7) * 0.9;
          let ax = (gx - p.x) * k;
          let ay = (gy - p.y) * k;
          const mx = p.x - mouse.x, my = p.y - mouse.y;
          const md = mx * mx + my * my;
          let lit = false;
          if (md < R * R) {
            const d = Math.sqrt(md) || 1;
            const f = (1 - d / R) * 2.6;
            ax += (mx / d) * f;
            ay += (my / d) * f;
            lit = d < R * 0.85;
          }
          if (pr > 0) {
            const hd = Math.hypot(tx(p) - hx, ty(p) - hy);
            if (Math.abs(hd - pr) < ew * 0.035) {
              lit = true;
              ax += ((tx(p) - hx) / (hd || 1)) * 0.35;
              ay += ((ty(p) - hy) / (hd || 1)) * 0.35;
            }
          }
          p.vx = (p.vx + ax) * damp;
          p.vy = (p.vy + ay) * damp;
          p.x += p.vx;
          p.y += p.vy;
          lists[lit ? LIT : p.c].push(i);
        }

        ctx.globalAlpha = 1 - sp * 0.9;
        const half = dot / 2;
        for (let b = 0; b < lists.length; b++) {
          const l = lists[b];
          if (!l.length) continue;
          ctx.fillStyle = GOLDS[b];
          ctx.beginPath();
          const s = b === LIT ? dot * 1.25 : dot;
          for (const i of l) ctx.rect(pts[i].x - half, pts[i].y - half, s, s);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else place();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (x: number, y: number) => {
      const hb = H.getBoundingClientRect();
      mouse.x = x - hb.left;
      mouse.y = y - hb.top;
    };
    const pm = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => e.touches[0] && onMove(e.touches[0].clientX, e.touches[0].clientY);
    const away = () => {
      mouse.x = mouse.y = -9999;
    };
    // click / tap near the emblem: the dust bursts and comes back together
    const burst = (e: PointerEvent) => {
      const hb = H.getBoundingClientRect();
      const bx = e.clientX - hb.left, by = e.clientY - hb.top;
      if (bx < sx - 40 || bx > sx + ew + 40 || by < sy - 40 || by > sy + eh + 40) return;
      for (const p of pts) {
        const ox = p.x - bx, oy = p.y - by;
        const d = Math.hypot(ox, oy) || 1;
        const f = Math.max(0, 1 - d / (ew * 0.9)) * 16 * (0.6 + p.r * 0.8);
        p.vx += (ox / d) * f;
        p.vy += (oy / d) * f;
      }
    };

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    const ro = new ResizeObserver(() => layout());
    const unsub = intro.sub(() => place());

    img.onload = () => {
      sample();
      layout();
      place();
      io.observe(c);
      ro.observe(H);
      ro.observe(S);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", pm, { passive: true });
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", away, { passive: true });
    document.documentElement.addEventListener("pointerleave", away);
    window.addEventListener("pointerdown", burst, { passive: true });
    return () => {
      img.onload = null;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      unsub();
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", away);
      document.documentElement.removeEventListener("pointerleave", away);
      window.removeEventListener("pointerdown", burst);
    };
  }, [hero, slot]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
