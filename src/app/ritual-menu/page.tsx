/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { zeniqTech } from "@/common/font";
import Image from "next/image";
import Footer from "@/components/client/footer";
import data from "@/common/data";

// --- Motion Variants ---
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};
const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const DEFAULT_HEADER =
  "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495830/ritual_menus_i3wneu.jpg";

type Service = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  order?: number;
};

type Membership = {
  id: string;
  duration: string;
  benefits: string[];
  imageUrl?: string;
};

export default function RitualMenu() {
  const [isPopupContactOpen, setIsPopupContactOpen] = useState(false);
  const [month, setMonth] = useState<string>("3 Bulan");

  const [title, setTitle] = useState("Ritual Menu's");
  const [subtitle, setSubtitle] = useState(
    "Temukan layanan dan program membership eksklusif dari Haircoolest."
  );
  const [headerImg, setHeaderImg] = useState<string>(DEFAULT_HEADER);

  const [services, setServices] = useState<Service[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [bookingTitle, setBookingTitle] = useState(
    "Booking & Ask Us for Price"
  );
  const [bookingCtaText, setBookingCtaText] = useState("Hubungi Kami");

  const [mounted, setMounted] = useState(false);
  const cancelRef = useRef(false);

  // ESC to close popup
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") setIsPopupContactOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
      cancelRef.current = true;
    };
  }, [escFunction]);

  // Load content from Firestore (client safe)
  useEffect(() => {
    let timeoutId: number | undefined;

    (async () => {
      try {
        timeoutId = window.setTimeout(() => {
          if (!cancelRef.current) {
            setHeaderImg((h) => h || DEFAULT_HEADER);
          }
        }, 3500);

        const mod = await import("@/services/ritual-menu");
        const [
          fTitle,
          fSubtitle,
          fHeader,
          fServices,
          fMemberships,
          fBookingTitle,
          fBookingCtaText,
        ] = await Promise.all([
          mod.getTitle?.().catch(() => null),
          mod.getSubtitle?.().catch(() => null),
          mod.getHeaderImage?.().catch(() => null),
          mod.getServices?.().catch(() => []),
          mod.getMemberships?.().catch(() => []),
          mod.getBookingTitle?.().catch(() => null),
          mod.getBookingCtaText?.().catch(() => null),
        ]);

        if (!cancelRef.current) {
          if (fTitle) setTitle(fTitle);
          if (fSubtitle) setSubtitle(fSubtitle);
          if (fHeader) setHeaderImg(fHeader || DEFAULT_HEADER);
          if (Array.isArray(fServices)) setServices(fServices);
          if (Array.isArray(fMemberships)) setMemberships(fMemberships);
          if (fBookingTitle) setBookingTitle(fBookingTitle);
          if (fBookingCtaText) setBookingCtaText(fBookingCtaText);
        }
      } catch (err) {
        console.error("Failed to load ritual-menu content:", err);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    })();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Decorative grid
  const gridBg = useMemo(
    () =>
      "bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.06),transparent_40%),repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_22px),repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_22px)]",
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("@/services/ritual-menu");
        const list = await mod.getServices?.().catch(() => []);
        if (!cancelled && Array.isArray(list)) setServices(list);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const servicesSorted = useMemo(
    () => [...services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [services]
  );

  const membershipFallback: Membership[] = useMemo(() => {
    if (memberships.length) return memberships;
    // fallback pakai data lama jika belum ada
    return (data.memberships || []).map((m: any, i: number) => ({
      id: `fallback-${i}`,
      duration: m.duration,
      benefits: m.benefits,
      imageUrl:
        "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495812/membercard_haircoolest_f9jnel.jpg",
    }));
  }, [memberships]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  function refreshNavState(el: HTMLDivElement) {
    const atStart = el.scrollLeft <= 2;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
    setCanPrev(!atStart);
    setCanNext(!atEnd);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // init & listeners
    const onScroll = () => refreshNavState(el);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [servicesSorted.length]);

  function scrollByStep(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.querySelector("article") as HTMLElement | null;
    const gap =
      parseFloat(
        getComputedStyle(el).columnGap || getComputedStyle(el).gap || "16"
      ) || 16;
    const step =
      (firstCard?.clientWidth ?? Math.round(el.clientWidth * 0.9)) + gap;

    const target = Math.max(
      0,
      Math.min(
        el.scrollWidth - el.clientWidth,
        el.scrollLeft + dir * step * 1.1
      )
    );
    el.scrollTo({ left: target, behavior: "smooth" });
  }

  return (
    <div className={`min-h-screen bg-black text-white ${gridBg} relative`}>
      {/* Ambient */}
      {mounted && (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 opacity-[0.05] mix-blend-soft-light"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 2px, transparent 4px)",
            }}
          />
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35))]" />
        </>
      )}

      {/* ===================== HEADER ===================== */}
      <header className="relative h-[52vh] md:h-[64vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={headerImg || DEFAULT_HEADER}
            alt="Haircoolest Barbershop"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          {mounted && (
            <motion.div
              initial={{ x: "-40%" }}
              animate={{ x: "120%" }}
              transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
              className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-red-600/20 to-transparent blur-[6px]"
            />
          )}
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-red-600 drop-shadow-[0_0_18px_rgba(220,38,38,0.35)] ${zeniqTech.className}`}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-gray-300 ${zeniqTech.className}`}
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="mx-auto mt-6 h-[2px] w-48 md:w-64 bg-gradient-to-r from-transparent via-red-600/60 to-transparent blur-[0.5px]"
          />
        </motion.div>

        <span className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-zinc-600/70" />
        <span className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-zinc-600/70" />
        <span className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-zinc-600/70" />
        <span className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-zinc-600/70" />
      </header>

      {/* ===================== SERVICES ===================== */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`text-center text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-red-600 ${zeniqTech.className}`}
          >
            Our Services
          </motion.h2>

          {/* horizontal scroll list (simple slider) */}
          <div className="relative">
            {/* tombol kiri */}
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByStep(-1)}
              disabled={!canPrev}
              className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border px-2 py-2 bg-black/60 border-zinc-700/70 backdrop-blur hover:bg-black/80 transition${
                !canPrev
                  ? "opacity-40 cursor-not-allowed"
                  : "shadow-[0_0_18px_rgba(220,38,38,0.25)]"
              }`}
            >
              {/* icon ← */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                className="text-red-600"
              >
                <path
                  fill="currentColor"
                  d="M15 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* tombol kanan */}
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByStep(1)}
              disabled={!canNext}
              className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border px-2 py-2 bg-black/60 border-zinc-700/70 backdrop-blur hover:bg-black/80 transition${
                !canNext
                  ? "opacity-40 cursor-not-allowed"
                  : "shadow-[0_0_18px_rgba(220,38,38,0.25)]"
              }`}
            >
              {/* icon → */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                className="text-red-600"
              >
                <path
                  fill="currentColor"
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* edge fade biar elegan */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent" />

            {/* track */}
            <div
              ref={scrollerRef}
              className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
            >
              {(servicesSorted.length ? servicesSorted : []).map((s) => (
                <article
                  key={s.id}
                  className="min-w-[280px] max-w-[320px] snap-start border border-zinc-700/70 bg-black/50 p-4 hover:shadow-[0_0_24px_rgba(220,38,38,0.18)] transition"
                >
                  <div className="mb-3 overflow-hidden border border-zinc-700/70">
                    <Image
                      src={s.imageUrl}
                      alt={s.name}
                      width={640}
                      height={360}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-red-600">{s.name}</h3>
                  <p className="mt-1 text-sm text-gray-300">{s.description}</p>
                </article>
              ))}
              {!servicesSorted.length && (
                <div className="w-full text-center text-neutral-400">
                  Belum ada layanan — segera tambahkan dari Dashboard.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===================== MEMBERSHIP ===================== */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-zinc-900/60 border-y border-zinc-800">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`text-center text-3xl md:text-4xl font-bold mb-8 text-white ${zeniqTech.className}`}
          >
            Membership Program
          </motion.h2>

          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {membershipFallback.map((m, index) => (
                <motion.article
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="
                    group relative border border-zinc-700/70 bg-black/50 p-5
                    shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-300
                    hover:translate-y-[-2px] hover:shadow-[0_0_24px_rgba(220,38,38,0.18)]
                  "
                >
                  <span className="pointer-events-none absolute inset-0 opacity-0 blur-[3px] transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-r from-transparent via-red-600/15 to-transparent" />
                  <div className="mb-4 overflow-hidden border border-zinc-700/70">
                    <Image
                      src={
                        m.imageUrl ||
                        "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495812/membercard_haircoolest_f9jnel.jpg"
                      }
                      alt="membership card"
                      width={800}
                      height={480}
                      className="h-40 w-full object-cover md:h-44 lg:h-48"
                    />
                  </div>
                  <h3
                    className={`text-xl md:text-2xl font-extrabold tracking-widest text-red-600 ${zeniqTech.className}`}
                  >
                    Membership {m.duration}
                  </h3>

                  <button
                    className={`mt-3 w-full cybr-btn ${zeniqTech.className}`}
                    onClick={() => {
                      setMonth(m.duration);
                      setIsPopupContactOpen(true);
                    }}
                  >
                    Get Started
                  </button>

                  <div className="mt-5">
                    <p className="text-base font-medium text-white/90">
                      Benefits:
                    </p>
                    <ul className="mt-2 space-y-2">
                      {m.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="mt-0.5 h-5 w-5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.6}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                          <span className="text-gray-200">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-zinc-600/70 group-hover:border-red-600/70" />
                  <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-zinc-600/70 group-hover:border-red-600/70" />
                  <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-zinc-600/70 group-hover:border-red-600/70" />
                  <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-zinc-600/70 group-hover:border-red-600/70" />
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===================== BOOKING ===================== */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-5xl text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`text-3xl md:text-4xl font-bold mb-6 text-red-600 ${zeniqTech.className}`}
          >
            {bookingTitle}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center"
          >
            <button
              onClick={() => setIsPopupContactOpen(true)}
              className="cybr-btn min-w-[220px]"
            >
              {bookingCtaText}
            </button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />

      {/* ===================== POPUP CONTACT ===================== */}
      {isPopupContactOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative w-[92%] max-w-sm sm:max-w-md border border-zinc-700/70 bg-black/80 p-5 shadow-[0_0_24px_rgba(220,38,38,0.2)]"
            role="dialog"
            aria-modal="true"
          >
            <button
              className="absolute right-4 top-3 text-white/80 transition hover:text-red-600 focus:outline-none"
              onClick={() => setIsPopupContactOpen(false)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <h1
              className={`mt-2 text-center text-2xl font-bold ${zeniqTech.className}`}
            >
              HUBUNGI KAMI
            </h1>

            <div className="mx-auto mt-5 grid grid-cols-2 gap-3">
              <a
                href={data.social_media.instagram}
                className="group flex flex-col items-center border border-zinc-700/70 bg-black/40 p-3 transition hover:border-red-600/70"
              >
                <img
                  src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495812/ig_eozbne.png"
                  alt="Instagram"
                  className="h-10"
                />
                <span className="mt-2 text-sm text-gray-200">Instagram</span>
              </a>

              <a
                href={
                  data.whatsapp +
                  `?text=Saya%20ingin%20membeli%20membership%20${month.replace(
                    " ",
                    "%20"
                  )}%20haircoolest`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center border border-zinc-700/70 bg-black/40 p-3 transition hover:border-red-600/70"
              >
                <img
                  src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495834/wa_xxlgih.png"
                  alt="Whatsapp"
                  className="h-10"
                />
                <span className="mt-2 text-sm text-gray-200">Whatsapp</span>
              </a>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/20" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                Atau
              </span>
              <span className="h-px flex-1 bg-white/20" />
            </div>

            <p className="text-center text-sm text-gray-200">
              Email ke{" "}
              <a
                href={`mailto:${data.social_media.email}`}
                className="font-bold underline"
              >
                {data.social_media.email}
              </a>
            </p>
          </motion.div>
        </div>
      )}

      {/* Local styles tombol */}
      <style jsx>{`
        .cybr-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(161, 161, 170, 0.7);
          background: rgba(0, 0, 0, 0.6);
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: white;
          transition: box-shadow 0.25s ease, border-color 0.25s ease,
            transform 0.25s ease;
          backdrop-filter: blur(6px);
          box-shadow: 0 0 18px rgba(220, 38, 38, 0.15);
        }
        .cybr-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(220, 38, 38, 0.2),
            transparent
          );
          filter: blur(3px);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .cybr-btn:hover {
          border-color: rgba(220, 38, 38, 0.7);
          box-shadow: 0 0 28px rgba(220, 38, 38, 0.35);
          transform: translateY(-1px);
        }
        .cybr-btn:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
