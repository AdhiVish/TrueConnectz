import { Fragment, type ReactNode } from "react";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className = "", y = 40 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** One heading word or an accent ({ em }) rendered in metallic gold italic. */
export type Part = string | { em: string };

/** Heading whose words rise out of a mask, one after another. */
export function RiseHeading({ parts, className = "", as = "h2", delay = 0 }: { parts: Part[]; className?: string; as?: "h1" | "h2"; delay?: number }) {
  const Tag = motion[as];
  const words: { w: string; em: boolean }[] = [];
  parts.forEach((p) => {
    const em = typeof p !== "string";
    (em ? p.em : p).split(" ").filter(Boolean).forEach((w) => words.push({ w, em }));
  });
  return (
    <Tag className={className} initial="hide" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {words.map(({ w, em }, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className={`inline-block ${em ? "metal-text pr-[0.06em] italic" : ""}`}
              variants={{ hide: { y: "110%", rotate: 3 }, show: { y: "0%", rotate: 0 } }}
              transition={{ duration: 1, delay: delay + i * 0.06, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Section heading: gold eyebrow, big serif title rising in, optional lead line. */
export function SectionHead({ eyebrow, parts, lead, className = "", center = false }: { eyebrow: string; parts: Part[]; lead?: string; className?: string; center?: boolean }) {
  return (
    <div className={`mb-14 max-w-[820px] md:mb-20 ${center ? "mx-auto text-center" : ""} ${className}`}>
      <Reveal y={16}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <RiseHeading parts={parts} className="section-h2" />
      {lead && (
        <Reveal delay={0.2} y={16}>
          <p className={`mt-5 max-w-[560px] text-mut ${center ? "mx-auto" : ""}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
