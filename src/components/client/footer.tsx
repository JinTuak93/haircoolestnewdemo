/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { FiMapPin } from "react-icons/fi";
import {
  IoLogoInstagram,
  IoLogoWhatsapp,
  IoMailOutline,
} from "react-icons/io5";
import { useState, useCallback, useEffect } from "react";
import { bookingEmail } from "@/lib/send-mail";
import { zeniqNano, zeniqTech } from "@/common/font";
import data from "@/common/data";
import toast from "react-hot-toast";

export default function Footer() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupEmailOpen, setIsPopupEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") {
      setIsPopupEmailOpen(false);
      setIsPopupOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookingEmail(email, name, phone, message);
      setIsPopupEmailOpen(false);
      toast.success("Berhasil mengirim email");
    } catch (e) {
      setIsPopupEmailOpen(false);
      toast.error("Gagal mengirim email");
    }
  };

  return (
    <footer className="w-full z-50 bg-transparent h-16 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mx-auto max-w-screen-2xl pb-2 px-2 font-medium">
        {/* Social Media (Mobile: Above Map) */}
        <div className="flex gap-4 mb-4 md:mb-0 md:order-2 items-center">
          <button
            onClick={() => setIsPopupEmailOpen(true)}
            className="text-white hover:text-red-600 transition"
          >
            <IoMailOutline size={26} />
          </button>
          <a
            href={data.social_media.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-600 transition"
          >
            <IoLogoInstagram size={22} />
          </a>
          <a
            href={data.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-red-600 transition"
          >
            <IoLogoWhatsapp size={22} />
          </a>
        </div>

        {/* Left - Address */}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex flex-row gap-2 text-sm text-white hover:text-red-600 transition md:order-1 pb-10 md:pb-0 md:z-0"
        >
          <FiMapPin size={20} />
          <p className={`${zeniqNano.className}`}>Kuningan - Petojo Utara</p>
        </button>
      </div>

      {/* ==================== POPUP MAP (Redesigned) ==================== */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center mt-12 md:mt-0 z-[60]">
          <div
            role="dialog"
            aria-modal="true"
            className="cybr-dialog relative w-[92%] max-w-sm md:max-w-lg"
          >
            <button
              className="absolute top-2 right-3 text-white/85 hover:text-red-600 transition"
              onClick={() => setIsPopupOpen(false)}
              aria-label="Tutup popup peta"
            >
              ✕
            </button>

            <h2
              className={`text-xl md:text-2xl font-bold text-center tracking-widest text-red-600 ${zeniqTech.className}`}
            >
              PILIH LOKASI
            </h2>

            {/* Mobile layout: segmented on top, image center, hint bottom */}
            <div className="md:hidden mt-4 space-y-4">
              {/* Segmented actions */}
              <div className="cybr-seg">
                <a
                  href={data.maps_kuningan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cybr-seg-btn"
                >
                  Kuningan
                </a>
                <a
                  href={data.maps_petojo_utara}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cybr-seg-btn"
                >
                  Petojo Utara
                </a>
              </div>

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src="/assets/popup.jpeg"
                  alt="Map"
                  className="w-full h-auto"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
              </div>

              <p className="text-center text-xs text-white/70">
                Tap tombol lokasi untuk membuka Google Maps
              </p>
            </div>

            {/* Desktop layout: image first, buttons under (penempatan lama) */}
            <div className="hidden md:flex md:flex-col gap-4 mt-4">
              <img
                src="/assets/popup.jpeg"
                alt="Map"
                className="md:h-[34rem] w-full object-cover"
              />
              <div className="flex flex-row gap-3 mx-auto">
                <a
                  href={data.maps_kuningan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`cybr-btn-sm ${zeniqTech.className}`}
                >
                  Kuningan
                </a>
                <a
                  href={data.maps_petojo_utara}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`cybr-btn-sm ${zeniqTech.className}`}
                >
                  Petojo Utara
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POPUP EMAIL (Redesigned) ==================== */}
      {isPopupEmailOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center mt-12 md:mt-0 z-[60]">
          <div
            role="dialog"
            aria-modal="true"
            className="cybr-dialog relative w-[92%] max-w-sm md:max-w-md"
          >
            <button
              className="absolute top-2 right-3 text-white/85 hover:text-red-600 transition"
              onClick={() => setIsPopupEmailOpen(false)}
              aria-label="Tutup popup email"
            >
              ✕
            </button>

            <h2
              className={`text-xl font-bold text-center tracking-widest text-red-600 ${zeniqTech.className}`}
            >
              HUBUNGI KAMI
            </h2>

            {/* Form: mobile re-ordered; desktop keep original order + 2 cols */}
            <form
              id="emailForm"
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              {/* MOBILE ORDER: 1=Nama, 2=No HP, 3=Email, 4=Pesan */}
              <div className="order-1 md:order-2 md:col-span-1">
                <label
                  htmlFor="name"
                  className={`text-xs uppercase tracking-[0.18em] text-white/80 ${zeniqTech.className}`}
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="cybr-input"
                  placeholder="Nama lengkap"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="order-2 md:order-3 md:col-span-1">
                <label
                  htmlFor="phone"
                  className={`text-xs uppercase tracking-[0.18em] text-white/80 ${zeniqTech.className}`}
                >
                  No HP
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="cybr-input"
                  placeholder="+62…"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="order-3 md:order-1 md:col-span-2">
                <label
                  htmlFor="email"
                  className={`text-xs uppercase tracking-[0.18em] text-white/80 ${zeniqTech.className}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="cybr-input"
                  placeholder="you@domain.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="order-4 md:order-4 md:col-span-2">
                <label
                  htmlFor="message"
                  className={`text-xs uppercase tracking-[0.18em] text-white/80 ${zeniqTech.className}`}
                >
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="cybr-input min-h-28 resize-y"
                  placeholder="Tulis pesan kamu…"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Desktop submit (dalam form) */}
              <div className="hidden md:block md:col-span-2">
                <button
                  type="submit"
                  className={`cybr-btn w-full ${zeniqTech.className}`}
                >
                  Kirim
                </button>
              </div>
            </form>

            {/* Mobile sticky submit (di bawah popup) */}
            <div className="md:hidden">
              <div className="sticky bottom-0 -mx-5 -mb-5 px-5 pb-5 pt-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <button
                  type="submit"
                  form="emailForm"
                  className={`cybr-btn w-full ${zeniqTech.className}`}
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =============== Local Styles: cyberpunk dialog/inputs/buttons/segmented =============== */}
      <style jsx>{`
        .cybr-dialog {
          padding: 1.25rem;
          background: rgba(0, 0, 0, 0.82);
          border: 1px solid rgba(161, 161, 170, 0.7); /* zinc-600/70 */
          box-shadow: 0 0 24px rgba(220, 38, 38, 0.22);
          backdrop-filter: blur(6px);
          position: relative;
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
        .cybr-input {
          appearance: none;
          width: 100%;
          padding: 0.75rem 0.875rem;
          background: rgba(0, 0, 0, 0.65);
          color: #fff;
          border: 1px solid rgba(161, 161, 170, 0.7);
          outline: none;
          letter-spacing: 0.02em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          transition: border-color 0.25s ease, box-shadow 0.25s ease,
            transform 0.12s ease;
        }
        .cybr-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }
        .cybr-input:focus {
          border-color: rgba(220, 38, 38, 0.9);
          box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.6),
            0 0 18px rgba(220, 38, 38, 0.25);
          transform: translateY(-1px);
        }
        .cybr-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 800;
          color: #fff;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(161, 161, 170, 0.7);
          transition: border-color 0.25s ease, box-shadow 0.25s ease,
            transform 0.18s ease;
          box-shadow: 0 0 18px rgba(220, 38, 38, 0.18);
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

        .cybr-btn-sm {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 0.9rem;
          color: #fff;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(161, 161, 170, 0.7);
          transition: border-color 0.25s ease, box-shadow 0.25s ease,
            transform 0.18s ease;
        }
        .cybr-btn-sm:hover {
          border-color: rgba(220, 38, 38, 0.9);
          box-shadow: 0 0 22px rgba(220, 38, 38, 0.28);
          transform: translateY(-1px);
        }

        .cybr-seg {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .cybr-seg-btn {
          text-align: center;
          padding: 0.7rem 0.9rem;
          color: #fff;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(161, 161, 170, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 800;
          transition: border-color 0.25s ease, box-shadow 0.25s ease,
            transform 0.18s ease;
        }
        .cybr-seg-btn:hover {
          border-color: rgba(220, 38, 38, 0.9);
          box-shadow: 0 0 22px rgba(220, 38, 38, 0.28);
          transform: translateY(-1px);
        }
      `}</style>
    </footer>
  );
}
