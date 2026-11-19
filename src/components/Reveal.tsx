import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className = "", y = 34 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Section heading block: gold eyebrow, big serif title, optional lead line. */
export function SectionHead({ eyebrow, children, lead }: { eyebrow: string; children: ReactNode; lead?: string }) {
  return (
    <Reveal className="mb-14 max-w-[760px]">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-h2">{children}</h2>
      {lead && <p className="text-mut">{lead}</p>}
    </Reveal>
  );
}
