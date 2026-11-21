/**
 * Runs the gold shimmer animations only on elements that are on screen.
 * An animation that is off screen still costs a repaint every frame.
 */
export function startAnimPauser() {
  const SEL = ".metal-text, .metal-band";
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.toggleAttribute("data-anim-on", e.isIntersecting);
  });
  const seen = new WeakSet<Element>();
  const scan = () => document.querySelectorAll(SEL).forEach((el) => {
    if (!seen.has(el)) { seen.add(el); io.observe(el); }
  });
  scan();
  // new shimmer elements appear as tabs/sections change
  let queued = false;
  const mo = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; scan(); });
  });
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  return () => { io.disconnect(); mo.disconnect(); };
}
