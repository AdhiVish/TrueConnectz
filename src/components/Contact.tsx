import { useRef, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { asset, BRAND_PROMISE, CONTACT, FORMS, SERVICES } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";
import { Reveal, RiseHeading } from "./Reveal";

function Field({ spec, i }: { spec: string; i: number }) {
  const [name, type = "text", ...opts] = spec.split("|");
  const box =
    "peer w-full rounded-xl border border-hair bg-white/[0.03] px-4 pt-6 pb-2.5 font-t text-[15px] text-text transition-colors placeholder:text-transparent focus:border-gold focus:bg-white/[0.06] focus:outline-0";
  const label = "pointer-events-none absolute top-2 left-4 text-[10.5px] tracking-[.18em] text-mut uppercase transition-colors peer-focus:text-sun";
  return (
    <motion.label
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.035 }}
      className={`relative block ${type === "area" ? "sm:col-span-2" : ""}`}
    >
      {type === "select" ? (
        <select name={name} className={`${box} appearance-none [&_option]:bg-panel`}>
          {opts.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : type === "area" ? (
        <textarea name={name} rows={3} placeholder={name} className={box} />
      ) : (
        <input name={name} type={type === "email" || type === "tel" ? type : "text"} placeholder={name} className={box} />
      )}
      <span className={label}>{name}</span>
    </motion.label>
  );
}

/** One enquiry route per service; each can be sent by email or WhatsApp with the answers filled in. */
export function Contact() {
  const { form, setForm } = useUI();
  const ref = useRef<HTMLFormElement>(null);

  const message = () => {
    const lines = [`New enquiry: ${SERVICES[form].k}`];
    ref.current!.querySelectorAll("label").forEach((l) => {
      const c = l.querySelector("input,select,textarea") as HTMLInputElement | null;
      lines.push(`${c?.name}: ${c?.value || "-"}`);
    });
    return lines.join("\n");
  };
  const byEmail = (e: FormEvent) => {
    e.preventDefault();
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Website enquiry: ${SERVICES[form].s}`)}&body=${encodeURIComponent(message())}`;
  };
  const byWhatsApp = () => window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message())}`, "_blank");

  const routes = [
    { href: CONTACT.tel, label: CONTACT.phone, Icon: Phone },
    { href: `mailto:${CONTACT.email}`, label: CONTACT.email, Icon: Mail },
    { href: `https://wa.me/${CONTACT.whatsapp}`, label: "WhatsApp us", Icon: MessageCircle },
  ];

  return (
    <section id="contact" className="relative py-[100px] md:py-[140px]">
      <div aria-hidden className="pointer-events-none absolute right-0 bottom-20 size-[780px] translate-x-[130px] translate-y-[130px] rounded-full bg-[radial-gradient(closest-side,rgba(176,116,8,0.13),transparent)]" />
      <div className="wrap relative grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <Reveal y={16}>
            <p className="eyebrow">Contact us</p>
          </Reveal>
          <RiseHeading parts={["Tell us what", { em: "you need" }]} className="section-h2" />
          <Reveal delay={0.15}>
            <p className="mt-5 mb-10 max-w-[420px] text-mut">Choose the enquiry that fits. Each one goes to the right place and keeps the form short.</p>
            <div className="flex flex-col gap-3">
              {routes.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  className="group glass flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors hover:border-gold/50"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[image:var(--metal)] text-ink">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1 font-h text-[22px] break-all md:text-[24px]">{label}</span>
                  <ArrowRight className="size-4 -translate-x-1 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="glass rounded-[28px] p-5 md:p-8">
            <div role="tablist" className="no-scrollbar mb-6 flex gap-1 overflow-x-auto rounded-full border border-hair bg-black/30 p-1">
              {SERVICES.map((x, i) => (
                <button
                  key={x.s}
                  type="button"
                  role="tab"
                  aria-selected={i === form}
                  onClick={() => setForm(i)}
                  className={`relative shrink-0 cursor-pointer rounded-full border-0 bg-transparent px-4 py-2.5 text-[12px] font-medium tracking-[.1em] uppercase transition-colors md:flex-1 ${
                    i === form ? "text-ink" : "text-mut hover:text-text"
                  }`}
                >
                  {i === form && <motion.span layoutId="form-pill" className="absolute inset-0 rounded-full bg-[image:var(--metal)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">{x.s}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.form
                key={form}
                ref={ref}
                onSubmit={byEmail}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid gap-3 sm:grid-cols-2"
              >
                {FORMS[form].map((f, i) => (
                  <Field key={f} spec={f} i={i} />
                ))}
                <div className="mt-3 flex flex-wrap gap-3 sm:col-span-2">
                  <button className="btn" type="submit">
                    <Send className="size-4" /> Send by email
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={byWhatsApp}>
                    <MessageCircle className="size-4" /> Send on WhatsApp
                  </button>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Final call to action on a band of moving metallic gold. */
export function FinalCTA() {
  const { setForm } = useUI();
  const go = (i: number) => {
    setForm(i);
    goTo("contact");
  };
  return (
    <section className="metal-band relative overflow-hidden py-[110px] text-center text-ink md:py-[150px]">
      <img aria-hidden src={asset("brand/emblem.webp")} alt="" className="pointer-events-none absolute top-1/2 left-1/2 w-[70vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.08] mix-blend-multiply" />
      <div className="wrap relative">
        <RiseHeading parts={["Ready to", "connect?"]} className="mb-12 text-[clamp(52px,9vw,140px)] leading-[0.95]" />
        <Reveal delay={0.2} className="mx-auto flex max-w-[900px] flex-wrap justify-center gap-3">
          {SERVICES.map((s, i) => (
            <button key={s.cta} type="button" className="btn btn-ink" onClick={() => go(i)}>
              {s.cta} <ArrowRight className="size-4" />
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { setTab } = useUI();
  const names = ["HR Recruitment", "HR Consulting & Advisory", "True Connectz Academy", "Virtual HR Solutions"];
  return (
    <footer className="relative overflow-hidden bg-night pt-20 pb-10 text-sm text-mut">
      <div className="wrap grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <button type="button" onClick={() => goTo("home")} aria-label="True Connectz HR Services, home" className="cursor-pointer border-0 bg-transparent p-0">
            <img src={asset("brand/logo-white.webp")} alt="True Connectz HR Services" width={900} height={886} loading="lazy" className="h-[150px] w-auto" />
          </button>
          <p className="mt-5 max-w-[320px]">{BRAND_PROMISE}.</p>
        </div>
        <div>
          <h4 className="mb-4 text-[11.5px] font-semibold tracking-[.24em] text-sun uppercase">Services</h4>
          {names.map((n, i) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setTab(i);
                goTo("services");
              }}
              className="block cursor-pointer border-0 bg-transparent px-0 py-1.5 text-left text-[15px] text-text/75 transition-colors hover:text-sun"
            >
              {n}
            </button>
          ))}
        </div>
        <div>
          <h4 className="mb-4 text-[11.5px] font-semibold tracking-[.24em] text-sun uppercase">Contact</h4>
          {[
            [CONTACT.tel, CONTACT.phone],
            [`mailto:${CONTACT.email}`, CONTACT.email],
            ["#", "Privacy Policy"],
            ["#", "Terms of Use"],
          ].map(([h, l]) => (
            <a key={l} href={h} className="block py-1.5 text-[15px] text-text/75 transition-colors hover:text-sun">
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="wrap mt-16 flex flex-col items-center justify-between gap-3 border-t border-hair pt-6 text-[12px] md:flex-row">
        <p>&copy; True Connectz HR Services. Design preview.</p>
        <p className="metal-text font-h text-[16px] italic">Connecting Talent. Strengthening Organisations. Developing People.</p>
      </div>
    </footer>
  );
}

/** Floating WhatsApp button with a soft ping. */
export function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${CONTACT.whatsapp}`}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.8 }}
      whileHover={{ scale: 1.08 }}
      className="fixed right-5 bottom-5 z-[60] grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_26px_rgba(0,0,0,.4)]"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-25" />
      <MessageCircle className="relative size-7" strokeWidth={1.8} />
    </motion.a>
  );
}
