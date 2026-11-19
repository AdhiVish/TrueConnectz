import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ABOUT_MV, POSTS, PROOF, STEPS, WHY } from "@/data/site";
import { Reveal, SectionHead } from "./Reveal";

export function Why() {
  return (
    <section id="why" className="py-[80px] md:py-[110px]">
      <div className="wrap">
        <SectionHead eyebrow="Why True Connectz">
          Talent, HR systems and <em>workforce</em> development
        </SectionHead>
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-5">
          {WHY.map((w, i) => (
            <Reveal key={w.h} delay={i * 0.08} className="relative pt-[22px]">
              <motion.span
                className="absolute top-0 left-0 h-px w-full origin-left bg-[image:var(--metal)]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
              />
              <h3 className="mb-2 text-[25px]">{w.h}</h3>
              <p className="text-[15px] text-mut">{w.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Recruitment process: a gold line draws across, and each step lights up as it reaches it. */
export function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="bg-beige py-[80px] md:py-[110px]">
      <div className="wrap">
        <SectionHead eyebrow="How we work">
          A simple, <em>clear</em> recruitment process
        </SectionHead>
        <div ref={ref} className="relative grid grid-cols-2 gap-y-[26px] md:grid-cols-7 md:gap-y-0">
          <motion.span
            aria-hidden
            className="absolute top-[21px] right-[7%] left-[7%] hidden h-px origin-left bg-[image:var(--metal)] md:block"
            initial={{ scaleX: 0 }}
            animate={show ? { scaleX: 1 } : undefined}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
          {STEPS.map((s, i) => (
            <motion.div
              key={s}
              className="relative px-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.3 }}
            >
              <motion.b
                className="mx-auto mb-[18px] grid size-11 place-items-center rounded-full border border-gold2 bg-white text-[15px] font-semibold text-gold"
                initial={{ scale: 0.6 }}
                animate={show ? { scale: [0.6, 1.15, 1], backgroundColor: ["#fff", "#ffd830", "#fff"] } : undefined}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.3 }}
              >
                {i + 1}
              </motion.b>
              <span className="block text-sm text-[#4a4438]">{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <section id="proof" className="py-[80px] md:py-[110px]">
      <div className="wrap">
        <SectionHead
          eyebrow="Proof & credibility"
          lead="Placeholders for the client to fill in. Only verified figures, genuine testimonials and authorised logos will be shown."
        >
          Numbers and voices you can <em>trust</em>
        </SectionHead>
        <div className="mb-[34px] grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((p, i) => (
            <Reveal key={p} delay={i * 0.08} className="border border-dashed border-gold2 bg-white px-[22px] py-[34px] text-center">
              <strong className="block font-h text-[40px] font-medium text-gold2">&mdash;</strong>
              <span className="text-[13px] text-mut">{p}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="border border-dashed border-gold2 bg-white p-10 text-center font-h text-[26px] leading-[1.4] font-medium text-mut italic">
          A genuine client testimonial goes here, with the client's name, role and permission to publish.
        </Reveal>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="bg-beige py-[80px] md:py-[110px]">
      <div className="wrap grid items-start gap-10 md:grid-cols-2 md:gap-[70px]">
        <Reveal>
          <p className="eyebrow">About us</p>
          <h2 className="section-h2">
            Four services, one <em>people</em> partner
          </h2>
          <blockquote className="my-[26px] font-h text-[27px] leading-[1.45] font-medium italic">
            True Connectz HR Services partners with organisations to attract the right talent, strengthen HR practices, develop workplace
            capabilities and manage essential people operations.
          </blockquote>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-mut">
            Through recruitment, HR consulting, True Connectz Academy and Virtual HR Solutions, we support businesses and individuals at
            different stages of workforce growth.
          </p>
          <div className="mt-[30px] grid gap-[18px] sm:grid-cols-2">
            {ABOUT_MV.map((m) => (
              <div key={m.h} className="bg-white p-[22px] transition-shadow duration-300 hover:shadow-[0_14px_30px_-18px_rgba(176,116,8,0.5)]">
                <h4 className="mb-1.5 text-[12px] font-semibold tracking-[.2em] text-gold uppercase">{m.h}</h4>
                <p className="text-sm text-mut">{m.p}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Insights() {
  return (
    <section id="insights" className="py-[80px] md:py-[110px]">
      <div className="wrap">
        <SectionHead eyebrow="Insights & resources">
          Ideas for hiring, HR and <em>growth</em>
        </SectionHead>
        <div className="grid gap-[26px] md:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.h} delay={i * 0.1} className="group border-t border-ink pt-[22px]">
              <small className="text-[11px] tracking-[.2em] text-gold uppercase">{p.tag}</small>
              <h3 className="my-3 text-[28px] transition-colors group-hover:text-gold">{p.h}</h3>
              <p className="text-[15px] text-mut">{p.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
