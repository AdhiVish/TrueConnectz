import { useEffect, useRef, type RefObject } from "react";
import { asset } from "@/data/site";
import { intro } from "@/lib/intro";

/** Logo golds, darkest to brightest; the last one is the "lit" colour. */
const GOLDS = ["#7a4a04", "#a0620e", "#c88216", "#f0a818", "#ffc828", "#ffe25a", "#fff6b0"];
const LIT = GOLDS.length - 1;
const HAND = { u: 0.42, v: 0.47 }; // where the two hands meet, in emblem coordinates

/** How far (px) the hero's first screen drifts down while it scrolls away; the dust follows it. */
export const PARALLAX = 160;

type P = {
  au: number; av: number; // home inside the emblem, 0..1
  bu: number; bv: number; // home inside the wordmark
  z: number; // depth, -1..1 (the cloud is 3D)
  x: number; y: number; vx: number; vy: number; // flat position (before the 3D tilt)
  px: number; py: number; // where it was drawn last frame (screen)
  c: number; // colour bucket (+64 = lit by the pulse this frame)
  dx: number; dy: number; r: number; // scatter direction + randomness
  rel: number; // intro release time (s)
};

/** Sample the opaque pixels of a drawing into 0..1 points. */
function samplePoints(draw: (o: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number) {
  const oc = document.createElement("canvas");
  oc.width = w;
  oc.height = h;
  const o = oc.getContext("2d", { willReadFrequently: true })!;
  draw(o, w, h);
  const d = o.getImageData(0, 0, w, h).data;
  const pts: { u: number; v: number; lum: number }[] = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (d[i + 3] < 140) continue;
      pts.push({
        u: (x + 0.5 + (Math.random() - 0.5) * 0.3) / w,
        v: (y + 0.5 + (Math.random() - 0.5) * 0.3) / h,
        lum: (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255,
      });
    }
  return pts;
}

/**
 * The tc emblem as a 3D cloud of gold dust.
 * - takes over from the loader's emblem (same spot) and flies into `slot`
 * - tilts in 3D towards the cursor and sways on its own; nearer dust is brighter
 * - the cursor pushes the dust away and gold threads link it to nearby dust
 * - a "connection" pulse runs out from the handshake every few seconds
 * - click / tap: the dust re-forms as the TRUE CONNECTZ wordmark, then back
 * - scrolls away: the dust drifts apart
 * Drawn on one canvas covering `hero`; stops when it is off screen.
 */
export function ParticleEmblem({ hero, slot }: { hero: RefObject<HTMLElement | null>; slot: RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const H = hero.current!;
    const S = slot.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const small = window.matchMedia("(max-width: 767px)").matches;
    const SW = small ? 170 : 260; // sampling width
    const MAX = small ? 4200 : 9500; // dust budget

    let pts: P[] = [];
    let w = 0, h = 0;
    let sx = 0, sy = 0, ew = 0, eh = 0;
    let heroTop = 0, vh = 800;
    let dot = 2;
    let started = false;
    let t0 = 0;
    let shape = 0; // 0 = emblem, 1 = wordmark
    let morphAt = -10;
    const mouse = { x: -9999, y: -9999, on: false };
    const rot = { x: 0, y: 0 };
    let depthK = 0.13; // depth of the cloud (flattened for the wordmark so thin letters stay sharp)
    const lists: number[][] = GOLDS.map(() => []);

    const layout = () => {
      w = H.offsetWidth;
      h = H.offsetHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // layout position (ignores transforms like the entrance + parallax)
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
      vh = window.innerHeight;
      dot = Math.max(1.2, (ew / SW) * 0.92);
    };

    const img = new Image();
    img.src = asset("brand/emblem.webp");
    const build = () => {
      const sh = Math.round((SW * img.naturalHeight) / img.naturalWidth);
      const em = samplePoints((o, W, Hh) => o.drawImage(img, 0, 0, W, Hh), SW, sh);
      // the wordmark, drawn in the emblem's box
      const word = samplePoints(
        (o, W, Hh) => {
          o.fillStyle = "#fff";
          o.textAlign = "center";
          o.textBaseline = "middle";
          o.font = `600 ${Math.round(W * 0.2)}px Jost, sans-serif`;
          o.fillText("TRUE", W / 2, Hh * 0.3);
          // fit CONNECTZ to 88% of the box (font metrics vary)
          let fs = W * 0.16;
          o.font = `600 ${Math.round(fs)}px Jost, sans-serif`;
          const mw = o.measureText("CONNECTZ").width;
          if (mw > W * 0.88) fs *= (W * 0.88) / mw;
          o.font = `600 ${Math.round(fs)}px Jost, sans-serif`;
          o.fillText("CONNECTZ", W / 2, Hh * 0.62);
          o.fillRect(W * 0.12, Hh * 0.82, W * 0.76, Math.max(2, Hh * 0.025));
        },
        SW,
        sh,
      );
      const keep = em.length > MAX ? MAX / em.length : 1;
      const out: P[] = [];
      for (const e of em) {
        if (Math.random() > keep) continue;
        const b = word[(Math.random() * word.length) | 0];
        const a = Math.random() * Math.PI * 2;
        out.push({
          au: e.u, av: e.v, bu: b.u, bv: b.v,
          z: (Math.random() - 0.5) * 2,
          x: 0, y: 0, vx: 0, vy: 0, px: -99, py: -99,
          c: Math.max(0, Math.min(LIT - 1, Math.floor((e.lum - 0.3) * 10))),
          dx: Math.cos(a), dy: Math.sin(a), r: Math.random(),
          rel: 0,
        });
      }
      pts = out;
    };

    const hx = (p: P) => sx + (shape ? p.bu : p.au) * ew;
    const hy = (p: P) => sy + (shape ? p.bv : p.av) * eh;

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
          p.x = r.left - hb.left + p.au * r.width;
          p.y = r.top - hb.top + p.av * r.height;
          const ox = p.x - (r.left - hb.left + HAND.u * r.width);
          const oy = p.y - (r.top - hb.top + HAND.v * r.height);
          const d = Math.hypot(ox, oy) || 1;
          p.rel = 0.18 + (d / r.width) * 0.35 + Math.random() * 0.25;
          const f = 2 + Math.random() * 6;
          p.vx = (ox / d) * f - (oy / d) * f * 0.6;
          p.vy = (oy / d) * f + (ox / d) * f * 0.6;
        } else {
          p.x = hx(p);
          p.y = hy(p);
        }
      }
    };

    const morph = (to: number) => {
      if (shape === to) return;
      shape = to;
      morphAt = performance.now() / 1000;
      for (const p of pts) {
        const a = Math.random() * Math.PI * 2;
        const f = 4 + Math.random() * 10;
        p.vx += Math.cos(a) * f;
        p.vy += Math.sin(a) * f;
      }
    };

    let raf = 0;
    let visible = true;
    let pulseAt = 1.6;
    const near: number[] = [];
    const loop = () => {
      raf = 0;
      if (!visible) return;
      const now = performance.now() / 1000;
      ctx.clearRect(0, 0, w, h);
      if (!started) place();
      if (started) {
        const t = now - t0;
        const prog = Math.max(0, Math.min(1, (window.scrollY - heroTop) / Math.max(1, h)));
        const par = prog * PARALLAX;
        // the dust starts drifting apart once the emblem nears the top of the screen
        const from = Math.max(0, sy - vh * 0.35);
        const sp = Math.max(0, Math.min(1, (window.scrollY - heroTop - from) / (vh * 0.7)));
        if (shape && now - morphAt > 5) morph(0); // the wordmark holds a few seconds, then back to the logo

        const loose = t < 2.2 || now - morphAt < 1.4;
        const k = loose ? 0.035 : 0.06;
        const damp = loose ? 0.9 : 0.84;

        // 3D tilt: follows the cursor, sways gently on its own
        const cx = sx + ew / 2, cy = sy + eh / 2 + par;
        const mxN = mouse.on ? Math.max(-1, Math.min(1, (mouse.x - cx) / (w / 2))) : 0;
        const myN = mouse.on ? Math.max(-1, Math.min(1, (mouse.y - cy) / (vh / 2))) : 0;
        rot.y += (mxN * 0.5 + Math.sin(now * 0.35) * 0.14 - rot.y) * 0.05;
        rot.x += (-myN * 0.32 + Math.sin(now * 0.27) * 0.07 - rot.x) * 0.05;
        const cY = Math.cos(rot.y), sY = Math.sin(rot.y), cX = Math.cos(rot.x), sX = Math.sin(rot.x);
        depthK += ((shape ? 0.015 : 0.13) - depthK) * 0.06;
        const F = ew * 2.2, DEPTH = ew * depthK;

        if (t > pulseAt + 2.4) pulseAt = t + 2.5 + Math.random() * 2;
        const pr = shape ? -1 : (t - pulseAt) * ew * 0.9;
        const hhx = sx + HAND.u * ew, hhy = sy + HAND.v * eh;
        const R = small ? 60 : Math.max(90, ew * 0.13);
        for (const l of lists) l.length = 0;
        near.length = 0;

        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (t >= p.rel) {
            const e = sp > 0 ? Math.pow(sp, 1.4) * (0.4 + p.r) : 0;
            const gx = hx(p) + p.dx * e * 700;
            const gy = hy(p) + par + p.dy * e * 700 - e * 180 + Math.sin(now * 1.3 + p.au * 7) * 0.9;
            let ax = (gx - p.x) * k;
            let ay = (gy - p.y) * k;
            // the cursor pushes the dust (measured where it was drawn)
            const mx = p.px - mouse.x, my = p.py - mouse.y;
            const md = mx * mx + my * my;
            if (md < R * R) {
              const d = Math.sqrt(md) || 1;
              const f = (1 - d / R) * 2.6;
              ax += (mx / d) * f;
              ay += (my / d) * f;
            }
            if (pr > 0) {
              const ox = sx + p.au * ew - hhx, oy = sy + p.av * eh - hhy;
              const hd = Math.hypot(ox, oy);
              if (Math.abs(hd - pr) < ew * 0.035) {
                ax += (ox / (hd || 1)) * 0.35;
                ay += (oy / (hd || 1)) * 0.35;
                p.c |= 64;
              }
            }
            p.vx = (p.vx + ax) * damp;
            p.vy = (p.vy + ay) * damp;
            p.x += p.vx;
            p.y += p.vy;
          }
          // project into 3D (dust still held from the loader is drawn flat)
          let X = p.x - cx, Y = p.y - cy, s = 1;
          if (t >= p.rel) {
            const Z = p.z * DEPTH;
            const X1 = X * cY + Z * sY;
            const Z1 = -X * sY + Z * cY;
            const Y1 = Y * cX - Z1 * sX;
            const Z2 = Y * sX + Z1 * cX;
            s = F / (F + Z2);
            X = X1 * s;
            Y = Y1 * s;
          }
          p.px = cx + X;
          p.py = cy + Y;
          const ddx = p.px - mouse.x, ddy = p.py - mouse.y;
          const dd = ddx * ddx + ddy * ddy;
          let b = p.c & 63;
          if (p.c & 64 || dd < R * R * 0.7) b = LIT;
          else if (s > 1.03) b = Math.min(LIT - 1, b + 1);
          else if (s < 0.97) b = Math.max(0, b - 1);
          p.c &= 63;
          if (mouse.on && dd < R * R * 1.8 && near.length < 26 && (i & 3) === 0) near.push(i);
          lists[b].push(i);
        }

        const alpha = 1 - sp * 0.9;
        ctx.globalAlpha = alpha;
        const half = dot / 2;
        for (let b = 0; b < lists.length; b++) {
          const l = lists[b];
          if (!l.length) continue;
          ctx.fillStyle = GOLDS[b];
          ctx.beginPath();
          const sz = b === LIT ? dot * 1.3 : dot;
          for (const i of l) ctx.rect(pts[i].px - half, pts[i].py - half, sz, sz);
          ctx.fill();
        }
        // gold threads from the cursor to nearby dust
        if (near.length) {
          ctx.lineWidth = 0.7;
          for (const i of near) {
            const p = pts[i];
            const d = Math.hypot(p.px - mouse.x, p.py - mouse.y);
            ctx.strokeStyle = `rgba(255,216,48,${Math.max(0, 1 - d / (R * 1.35)) * 0.55 * alpha})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.px, p.py);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(loop);
    };

    const setMouse = (x: number, y: number) => {
      const hb = H.getBoundingClientRect();
      mouse.x = x - hb.left;
      mouse.y = y - hb.top;
      mouse.on = mouse.y > 0 && mouse.y < h;
    };
    const pm = (e: PointerEvent) => setMouse(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => e.touches[0] && setMouse(e.touches[0].clientX, e.touches[0].clientY);
    const away = () => {
      mouse.x = mouse.y = -9999;
      mouse.on = false;
    };
    // click / tap on the dust: it re-forms as the wordmark (and back)
    const click = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest?.("a,button,input,textarea,select")) return;
      const hb = H.getBoundingClientRect();
      const bx = e.clientX - hb.left, by = e.clientY - hb.top;
      if (bx < sx - 30 || bx > sx + ew + 30 || by < sy - 30 || by > sy + eh + 30) return;
      morph(shape ? 0 : 1);
    };

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    const ro = new ResizeObserver(() => layout());
    const unsub = intro.sub(() => place());

    img.onload = () => {
      const go = () => {
        build();
        layout();
        place();
        io.observe(c);
        ro.observe(H);
        ro.observe(S);
        raf = requestAnimationFrame(loop);
      };
      // the wordmark needs the brand font
      if (document.fonts?.load) document.fonts.load("600 40px Jost").then(go, go);
      else go();
    };
    window.addEventListener("pointermove", pm, { passive: true });
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", away, { passive: true });
    document.documentElement.addEventListener("pointerleave", away);
    window.addEventListener("pointerup", click, { passive: true });
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
      window.removeEventListener("pointerup", click);
    };
  }, [hero, slot]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
