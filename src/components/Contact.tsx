import { useRef, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { asset, BRAND_PROMISE, CONTACT, FORMS, SERVICES } from "@/data/site";
import { goTo, useUI } from "@/lib/ui";
import { Reveal } from "./Reveal";

function Field({ spec }: { spec: string }) {
  const [name, type = "text", ...opts] = spec.split("|");
  const box =
    "w-full rounded-[2px] border border-line bg-white px-3.5 py-[13px] font-t text-base text-ink transition-colors focus:border-gold2 focus:outline-0 focus:ring-2 focus:ring-sun/40";
  return (
    <label className={`grid gap-1.5 text-[12px] tracking-[.1em] text-mut uppercase ${type === "area" ? "sm:col-span-2" : ""}`}>
      {name}
      {type === "select" ? (
        <select name={name} className={box}>
          {opts.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : type === "area" ? (
        <textarea name={name} rows={3} className={box} />
      ) : (
        <input name={name} type={type === "email" || type === "tel" ? type : "text"} className={box} />
      )}
    </label>
  );
}

/** One enquiry route per service; each form can be sent by email or WhatsApp with the answers filled in. */
export function Contact() {
  const { form, setForm } = useUI();
  const ref = useRef<HTMLFormElement>(null);

  const message = () => {
    const f = ref.current!;
    const lines = [`New enquiry: ${SERVICES[form].k}`];
    f.querySelectorAll("label").forEach((l) => {
      const c = l.querySelector("input,select,textarea") as HTMLInputElement | null;
      lines.push(`${l.firstChild?.textContent}: ${c?.value || "-"}`);
    });
    return lines.join("\n");
  };
  const byEmail = (e: FormEvent) => {
    e.preventDefault();
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Website enquiry: ${SERVICES[form].s}`)}&body=${encodeURIComponent(message())}`;
  };
  const byWhatsApp = () => window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message())}`, "_blank");

  return (
    <section id="contact" className="bg-beige py-[80px] md:py-[110px]">
      <div className="wrap grid gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-[70px]">
        <Reveal>
          <p className="eyebrow">Contact us</p>
          <h2 className="section-h2 mb-6">
            Tell us what <em>you need</em>
          </h2>
          <p className="mb-[26px] text-mut">Choose the enquiry that fits. Each one goes to the right place and keeps the form short.</p>
          <div>
            {[
              [CONTACT.tel, CONTACT.phone],
              [`mailto:${CONTACT.email}`, CONTACT.email],
              [`https://wa.me/${CONTACT.whatsapp}`, "WhatsApp us"],
            ].map(([href, label]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener"
                className="group my-1.5 block w-fit font-h text-[30px] break-all transition-colors hover:text-gold"
              >
                {label}
                <span className="block h-px w-0 bg-[image:var(--metal)] transition-[width] duration-500 group-hover:w-full" />
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div role="tablist" className="mb-[26px] flex flex-wrap gap-1.5 border-b border-line">
            {SERVICES.map((x, i) => (
              <button
                key={x.s}
                type="button"
                role="tab"
                aria-selected={i === form}
                onClick={() => setForm(i)}
                className={`relative -mb-px cursor-pointer border-0 bg-transparent px-[18px] py-4 text-[13px] font-medium tracking-[.1em] uppercase transition-colors ${
                  i === form ? "text-ink" : "text-mut hover:text-ink"
                }`}
              >
                {x.s}
                {i === form && <motion.span layoutId="form-line" className="absolute inset-x-0 bottom-0 h-[2px] bg-[image:var(--metal)]" />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.form
              key={form}
              ref={ref}
              onSubmit={byEmail}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid gap-3.5 sm:grid-cols-2"
            >
              {FORMS[form].map((f) => (
                <Field key={f} spec={f} />
              ))}
              <div className="mt-1.5 flex flex-wrap gap-3 sm:col-span-2">
                <button className="btn" type="submit">
                  Send by email
                </button>
                <button className="btn btn-o" type="button" onClick={byWhatsApp}>
                  Send on WhatsApp
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const { setForm } = useUI();
  const go = (i: number) => {
    setForm(i);
    goTo("contact");
  };
  return (
    <section className="relative overflow-hidden bg-ink py-[100px] text-center text-white">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,168,24,0.18),transparent_60%)]"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="wrap relative">
        <Reveal>
          <h2 className="mb-[34px] text-[clamp(36px,5vw,64px)]">
            Ready to <em className="metal-text pr-[0.06em]">connect</em>?
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-wrap justify-center gap-3.5">
          {SERVICES.map((s, i) => (
            <button key={s.cta} type="button" className={`btn ${i ? "btn-o-light" : ""}`} onClick={() => go(i)}>
              {s.cta}
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { setTab } = useUI();
  return (
    <footer className="bg-ink pt-[60px] pb-[34px] text-sm text-[#b9ad95]">
      <div className="wrap grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <button type="button" onClick={() => goTo("home")} aria-label="True Connectz HR Services, home" className="cursor-pointer border-0 bg-transparent p-0">
            <img src={asset("brand/logo-white.webp")} alt="True Connectz HR Services" width={900} height={886} loading="lazy" className="h-[120px] w-auto" />
          </button>
          <p className="mt-4 max-w-[320px]">{BRAND_PROMISE}.</p>
        </div>
        <div>
          <h4 className="mb-3.5 text-[12px] font-semibold tracking-[.2em] text-white uppercase">Services</h4>
          {SERVICES.map((s, i) => (
            <button
              key={s.k}
              type="button"
              onClick={() => {
                setTab(i);
                goTo("services");
              }}
              className="block cursor-pointer border-0 bg-transparent px-0 py-[3px] text-left text-[#b9ad95] transition-colors hover:text-sun"
            >
              {s.k === "HR Consulting, Advice & Audits" ? "HR Consulting & Advisory" : s.k === "Specialised HR Recruitment" ? "HR Recruitment" : s.k}
            </button>
          ))}
        </div>
        <div>
          <h4 className="mb-3.5 text-[12px] font-semibold tracking-[.2em] text-white uppercase">Contact</h4>
          <a href={CONTACT.tel} className="block py-[3px] transition-colors hover:text-sun">
            {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="block py-[3px] transition-colors hover:text-sun">
            {CONTACT.email}
          </a>
          <a href="#" className="block py-[3px] transition-colors hover:text-sun">
            Privacy Policy
          </a>
          <a href="#" className="block py-[3px] transition-colors hover:text-sun">
            Terms of Use
          </a>
        </div>
      </div>
      <div className="wrap mt-10 border-t border-[#3a352b] pt-[22px] text-center text-[12px]">
        <p>&copy; True Connectz HR Services. Design preview.</p>
      </div>
    </footer>
  );
}

/** Floating WhatsApp button (as in the original). */
export function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${CONTACT.whatsapp}`}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.5 }}
      whileHover={{ scale: 1.08 }}
      className="fixed right-5 bottom-5 z-[60] grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_26px_rgba(0,0,0,.25)]"
    >
      <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.32 11.32 0 0 0 12.04.72C5.79.72.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.66L.6 23.6l6.02-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.31-8.02z" />
      </svg>
    </motion.a>
  );
}
