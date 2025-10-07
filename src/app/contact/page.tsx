/* eslint-disable @next/next/no-img-element */
"use client";

import data from "@/common/data";
import { zeniqTech } from "@/common/font";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ====== Hero / Split Layout ====== */}
      <section className="relative">
        {/* Ambient cyber grid */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-screen"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_24px),repeating-linear-gradient(0deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_24px)",
          }}
        />
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          {/* Left visual panel */}
          <section className="hidden relative md:flex h-40 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6 overflow-hidden">
            <img
              alt="Haircoolest backdrop"
              src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495808/background_w7uym6.jpg"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            {/* red accent sweep */}
            <motion.div
              initial={{ x: "-40%" }}
              animate={{ x: "120%" }}
              transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
              className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-red-600/25 to-transparent"
            />
            {/* bottom glow rail */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />
          </section>

          {/* Right form panel */}
          <main className="pt-20 md:pt-0 flex items-center justify-center px-6 md:px-10 lg:col-span-7 lg:px-14 lg:py-12 xl:col-span-6">
            <div className="w-full max-w-xl relative border border-zinc-700/70 bg-black/60 backdrop-blur-md p-6 md:p-8 shadow-[0_0_24px_rgba(220,38,38,0.18)]">
              {/* corner brackets */}
              <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-zinc-600/70" />
              <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-zinc-600/70" />
              <span className="pointer-events-none absolute left-2 bottom-2 h-5 w-5 border-l-2 border-b-2 border-zinc-600/70" />
              <span className="pointer-events-none absolute right-2 bottom-2 h-5 w-5 border-r-2 border-b-2 border-zinc-600/70" />

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`text-3xl md:text-4xl font-bold mb-6 text-center tracking-widest text-red-600 drop-shadow-[0_0_16px_rgba(220,38,38,0.35)] ${zeniqTech.className}`}
              >
                Hubungi Kami
              </motion.h1>

              <form className="flex flex-col gap-5">
                {/* Email */}
                <div className="flex flex-col gap-2">
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
                    placeholder="you@domain.com"
                    required
                    className="cybr-input"
                  />
                </div>

                {/* Nama */}
                <div className="flex flex-col gap-2">
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
                    placeholder="Nama lengkap"
                    required
                    className="cybr-input"
                  />
                </div>

                {/* No HP */}
                <div className="flex flex-col gap-2">
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
                    placeholder="+62…"
                    required
                    className="cybr-input"
                  />
                </div>

                {/* Pesan */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className={`text-xs uppercase tracking-[0.18em] text-white/80 ${zeniqTech.className}`}
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tulis pesan kamu…"
                    required
                    className="cybr-input min-h-28 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className={`cybr-btn ${zeniqTech.className}`}
                >
                  Kirim
                </button>
              </form>
            </div>
          </main>
        </div>
      </section>

      {/* ====== Locations (responsive grid) ====== */}
      <div className="max-w-7xl mx-auto mt-16 md:mt-20 py-10 px-4 sm:px-6 lg:px-8">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-8 text-red-600 tracking-widest ${zeniqTech.className}`}
        >
          Contact Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kuningan */}
          <article className="border border-zinc-700/70 bg-black/60 p-6 shadow-[0_0_18px_rgba(220,38,38,0.15)]">
            <h3
              className={`text-xl font-bold text-white mb-3 tracking-wider ${zeniqTech.className}`}
            >
              Kuningan
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Alamat: Jl. Karet Belakang Barat No.9, RT.11/RW.4, Kuningan,
              Karet, Kecamatan Setiabudi, Kota Jakarta Selatan, DKI Jakarta
              12940
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none border border-red-600/40" />
              <iframe
                title="Map - Haircoolest Kuningan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3587388848073!2d106.82313740000001!3d-6.216332399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f500204196c3%3A0xd5a92e075f9ebe39!2sHaircoolest%20Barbershop%20%7C%20Kuningan!5e0!3m2!1sen!2sid!4v1742489387937!5m2!1sen!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          </article>

          {/* Petojo */}
          <article className="border border-zinc-700/70 bg-black/60 p-6 shadow-[0_0_18px_rgba(220,38,38,0.15)]">
            <h3
              className={`text-xl font-bold text-white mb-3 tracking-wider ${zeniqTech.className}`}
            >
              Petojo Utara
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Alamat: Jl. A.M Sangaji No.27, RT.8/RW.3, Petojo Utara, Kecamatan
              Gambir, Kota Jakarta Pusat, DKI Jakarta 10130
            </p>
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none border border-red-600/40" />
              <iframe
                title="Map - Haircoolest Petojo"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.755763679313!2d106.8129144!3d-6.1634548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7a026070e5f%3A0x7fa7884d454c6d4a!2sHaircoolest%20Barbershop%20%7C%20Petojo!5e0!3m2!1sen!2sid!4v1742489437289!5m2!1sen!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          </article>
        </div>

        {/* Info kontak */}
        <div className="mt-12 text-center">
          <h4
            className={`text-2xl font-bold mb-4 text-white tracking-wider ${zeniqTech.className}`}
          >
            Informasi Kontak
          </h4>
          <p className="text-gray-300 mb-2">Email: {data.social_media.email}</p>
          <p className="text-gray-300 mb-2">Telepon: {data.phone}</p>
          <p className="text-gray-300">Jam Operasional: 09:00 - 17:00</p>
        </div>
      </div>

      {/* local styles: inputs & button cyberpunk */}
      <style jsx>{`
        .cybr-input {
          appearance: none;
          width: 100%;
          padding: 0.75rem 0.875rem;
          background: rgba(0, 0, 0, 0.65);
          color: #fff;
          border: 1px solid rgba(161, 161, 170, 0.7); /* zinc-600/70 */
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
          border-color: rgba(220, 38, 38, 0.9); /* red-600 */
          box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.6),
            0 0 18px rgba(220, 38, 38, 0.25);
          transform: translateY(-1px);
        }

        .cybr-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.85rem 1rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 800;
          color: #fff;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(161, 161, 170, 0.7);
          transition: border-color 0.25s ease, box-shadow 0.25s ease,
            transform 0.2s ease;
        }
        .cybr-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(220, 38, 38, 0.28),
            transparent
          );
          filter: blur(3px);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .cybr-btn:hover {
          border-color: rgba(220, 38, 38, 0.9);
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
