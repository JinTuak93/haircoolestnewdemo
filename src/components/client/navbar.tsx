/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { zeniqHype, zeniqTech } from "@/common/font";
import Link from "next/link";
import data from "@/common/data";
import { IoLogoInstagram, IoLogoWhatsapp } from "react-icons/io5";

export default function NavigationBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupBookingOpen, setIsPopupBookingOpen] = useState(false);

  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") {
      setIsPopupBookingOpen(false);
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  const toggleMenu = () => setIsMenuOpen((s) => !s);

  if (pathname.includes("/admin")) return null;

  return (
    <nav className="w-full h-16 bg-transparent fixed top-0 left-0 z-[60]">
      {/* BACKDROP untuk mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md lg:hidden z-40"
          onClick={toggleMenu}
          aria-hidden
        />
      )}

      <div className="flex items-center justify-between mx-auto max-w-screen-2xl pt-6 px-4 sm:px-6 lg:px-8">
        {/* Logo (non-interaktif) */}
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="h-20 sm:h-28 absolute top-0 left-0 right-0 mx-auto mt-2 z-40 md:z-0 pointer-events-none"
        />

        {/* Hamburger (Mobile) — dinaikkan z supaya di atas panel */}
        <div className="lg:hidden fixed right-4 top-6 z-[80]">
          <button
            onClick={toggleMenu}
            className="h-10 w-10 flex items-center justify-center text-white/90 hover:text-red-500 focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* ===== Desktop NAV (TIDAK DIUBAH) ===== */}
        <div className="hidden lg:flex lg:items-center lg:gap-4 font-medium text-[12px]">
          <Link
            href="/"
            className={`${zeniqHype.className} cursor-pointer transition py-3 ${
              pathname === "/" ? "text-red-600" : "hover:text-red-600"
            }`}
          >
            HAVEN
          </Link>
          <Link
            href="/sanctuary"
            className={`${zeniqHype.className} cursor-pointer transition py-3 ${
              pathname === "/sanctuary" ? "text-red-600" : "hover:text-red-600"
            }`}
          >
            OUR SANCTUARY
          </Link>
          <Link
            href="/ritual-menu"
            className={`${zeniqHype.className} cursor-pointer transition py-3 ${
              pathname === "/ritual-menu"
                ? "text-red-600"
                : "hover:text-red-600"
            }`}
          >
            {"OUR RITUAL MENU'S"}
          </Link>
          <Link
            href="/cloud-lab"
            className={`${zeniqHype.className} cursor-pointer transition py-3 ${
              pathname === "/cloud-lab" ? "text-red-600" : "hover:text-red-600"
            }`}
          >
            OUR .CLOUD LAB
          </Link>
          <Link
            href="/cave"
            className={`${zeniqHype.className} cursor-pointer transition py-3 ${
              pathname === "/cave" ? "neon-text" : "hover:text-red-600"
            }`}
          >
            OUR CAVE
          </Link>
        </div>

        {/* Right: CTA & links (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-[12px]">
          <a
            href="/academy"
            className={`${zeniqHype.className} font-medium hover:text-red-600 transition`}
          >
            Haircoolest academy
          </a>
          <a
            href="/contact"
            className={`${zeniqHype.className} font-medium hover:text-red-600 transition underline`}
          >
            CONTACT US
          </a>
          <button
            onClick={() => setIsPopupBookingOpen(true)}
            className={`cybr-btn ${zeniqHype.className}`}
          >
            <span>BOOK NOW</span>
          </button>
        </div>
      </div>

      {/* ===== Mobile NAV ===== */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-[100dvh] w-full z-[70] transition-transform duration-300 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Panel neon */}
        <div className="relative h-full w-full bg-black/85">
          {/* decorative layers -> pointer-events-none supaya tidak blok klik */}
          <div className="pointer-events-none absolute inset-0 border border-zinc-700/70" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />

          {/* Close button di dalam panel (tambahan) */}
          {/* <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-4 top-5 z-[75] text-white/85 hover:text-red-500"
            aria-label="Close menu"
          >
            ✕
          </button> */}

          {/* Content */}
          <div className="relative z-[74] flex flex-col h-full pt-28 pb-20 px-6">
            {/* Links */}
            <nav className="space-y-1 text-center">
              {[
                { href: "/", label: "HAVEN" },
                { href: "/sanctuary", label: "OUR SANCTUARY" },
                { href: "/ritual-menu", label: "OUR RITUAL MENU'S" },
                { href: "/cloud-lab", label: "OUR .CLOUD LAB" },
                { href: "/cave", label: "OUR CAVE" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${
                    zeniqHype.className
                  } block py-4 text-xl tracking-widest ${
                    pathname === item.href
                      ? "text-red-600"
                      : "text-white hover:text-red-500"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Footer actions (mobile only) */}
            <div className="mt-auto flex flex-col items-center gap-4">
              <a
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`${zeniqHype.className} font-medium hover:text-red-600 transition underline`}
              >
                CONTACT US
              </a>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsPopupBookingOpen(true);
                }}
                className={`cybr-btn w-[min(240px,80%)] ${zeniqHype.className}`}
              >
                <span>BOOK NOW</span>
              </button>
            </div>
          </div>

          {/* corner brackets (safe) */}
          <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-zinc-600/70" />
          <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-zinc-600/70" />
          <span className="pointer-events-none absolute left-3 bottom-3 h-5 w-5 border-l-2 border-b-2 border-zinc-600/70" />
          <span className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 border-r-2 border-b-2 border-zinc-600/70" />
        </div>
      </div>

      {/* ===== Popup Booking (tetap) ===== */}
      {isPopupBookingOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="cybr-dialog relative w-[92%] max-w-sm sm:max-w-md"
          >
            <button
              className="absolute right-3 top-2 text-white/80 transition hover:text-red-600 focus:outline-none"
              onClick={() => setIsPopupBookingOpen(false)}
              aria-label="Close booking dialog"
            >
              ✕
            </button>

            <h2
              className={`mt-1 text-center text-2xl font-bold tracking-widest text-red-600 ${zeniqTech.className}`}
            >
              BOOKING MELALUI
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <a
                href={data.social_media.instagram}
                className="group flex flex-col items-center border border-zinc-700/70 bg-black/40 p-4 transition hover:border-red-600/70"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoInstagram
                  size={58}
                  className="group-hover:text-red-500"
                />
                <span className="mt-2 text-sm">Instagram</span>
              </a>

              <a
                href={data.whatsapp}
                className="group flex flex-col items-center border border-zinc-700/70 bg-black/40 p-4 transition hover:border-red-600/70"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoWhatsapp
                  size={58}
                  className="group-hover:text-red-500"
                />
                <span className="mt-2 text-sm">Whatsapp</span>
              </a>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/20" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                atau
              </span>
              <span className="h-px flex-1 bg-white/20" />
            </div>

            <p className="text-center text-sm text-gray-200">
              Prefer email?{" "}
              <a
                href={`mailto:${data.social_media.email}`}
                className="font-bold underline"
              >
                {data.social_media.email}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .cybr-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem 0.6rem; /* Padding diperkecil */
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          font-size: 0.85rem; /* Font size diperkecil */
          color: #fff;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(161, 161, 170, 0.7);
          transition: border-color 0.25s ease, box-shadow 0.25s ease,
            transform 0.18s ease;
          box-shadow: 0 0 18px rgba(220, 38, 38, 0.18);
          min-width: 180px;
          width: auto;
        }

        .cybr-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(220, 38, 38, 0.3),
            transparent
          );
          filter: blur(4px);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }

        .cybr-btn:hover {
          border-color: rgba(220, 38, 38, 0.9);
          box-shadow: 0 0 28px rgba(220, 38, 38, 0.36);
          transform: translateY(-1px);
        }

        .cybr-btn:hover::before {
          opacity: 1;
        }

        .cybr-dialog {
          padding: 1.25rem;
          background: rgba(0, 0, 0, 0.82);
          border: 1px solid rgba(161, 161, 170, 0.7);
          box-shadow: 0 0 24px rgba(220, 38, 38, 0.22);
        }
        .cybr-dialog::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(220, 38, 38, 0.14),
            transparent
          );
          filter: blur(3px);
          opacity: 0.7;
          pointer-events: none;
        }
      `}</style>
    </nav>
  );
}
