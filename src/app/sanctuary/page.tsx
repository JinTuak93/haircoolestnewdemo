/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { zeniqTech } from "@/common/font";
import {
  getSubtitle,
  getTitle,
  getHistoryText,
  getDisclaimerText,
  getHeaderImage,
  getSanctuaryImage,
  getVideoTitle,
  getVideos,
  getMainVideo,
} from "@/services/sanctuary";
import Footer from "@/components/client/footer";
import BarberSlider from "@/components/slider/barber";
import OurWorkSlider from "@/components/slider/our-work";
import SponsorMarquee from "@/components/client/sponsor-marquee";
import Image from "next/image";
import VideoSection from "@/components/client/video-section";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function Sanctuary() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [historyText, setHistoryText] = useState("");
  const [disclaimerText, setDisclaimerText] = useState("");
  const [headerImage, setHeaderImage] = useState(
    "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495808/background_t4qr2s.jpg"
  );
  const [sanctuaryImage, setSanctuaryImage] = useState(
    "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495830/sanctuary_jgjelp.jpg"
  );
  const [videoTitle, setVideoTitle] = useState("");
  const [videos, setVideos] = useState<{ id: string; url: string }[]>([]);
  const [mainVideo, setMainVideo] = useState<
    { id: string; url: string } | string | null
  >(null);
  const [loading, setLoading] = useState(true);

  const gridBg = useMemo(
    () =>
      // grid neon + vignette halus
      "bg-[radial-gradient(circle_at_50%_-10%,rgba(220,38,38,0.10),transparent_35%),repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_22px),repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_22px)]",
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          fetchedTitle,
          fetchedSubtitle,
          fetchedHistoryText,
          fetchedDisclaimerText,
          fetchedHeaderImage,
          fetchedSanctuaryImage,
          fetchedVideoTitle,
          fetchedVideos,
          fetchedMainVideo,
        ] = await Promise.all([
          getTitle(),
          getSubtitle(),
          getHistoryText(),
          getDisclaimerText(),
          getHeaderImage(),
          getSanctuaryImage(),
          getVideoTitle(),
          getVideos(),
          getMainVideo(),
        ]);

        setTitle(fetchedTitle || "Haircoolest Barbershop");
        setSubtitle(fetchedSubtitle || "");
        setHistoryText(fetchedHistoryText || "");
        setDisclaimerText(fetchedDisclaimerText || "");
        setVideoTitle(fetchedVideoTitle || "");
        setVideos(fetchedVideos || []);
        setMainVideo(fetchedMainVideo || null);

        if (fetchedHeaderImage) setHeaderImage(fetchedHeaderImage);
        if (fetchedSanctuaryImage) setSanctuaryImage(fetchedSanctuaryImage);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenPopup = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedImage("");
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen bg-black text-white ${gridBg} overflow-x-hidden`}
    >
      {/* scanline + vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 1px, transparent 2px, transparent 4px)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))]" />

      {/* ===================== HEADER ===================== */}
      <header className="relative h-[52vh] md:h-[64vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={headerImage || "/placeholder.svg"}
            alt="Haircoolest Barbershop"
            fill
            className="object-cover opacity-60"
          />
          {/* red sweep */}
          <motion.div
            initial={{ x: "-40%" }}
            animate={{ x: "120%" }}
            transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
            className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-red-600/25 to-transparent blur-[6px]"
          />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-red-600 drop-shadow-[0_0_18px_rgba(220,38,38,0.35)] ${zeniqTech.className}`}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
              delay: 0.05,
            }}
            className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-gray-300"
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="mx-auto mt-6 h-[2px] w-48 md:w-64 bg-gradient-to-r from-transparent via-red-600/70 to-transparent"
          />
        </motion.div>

        {/* corner brackets */}
        <span className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-zinc-600/70" />
        <span className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-zinc-600/70" />
        <span className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-zinc-600/70" />
        <span className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-zinc-600/70" />
      </header>

      {/* ===================== SEJARAH & BIOGRAPHY ===================== */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Text block (cyber frame) */}
          <motion.article
            variants={fadeIn}
            className="relative border border-zinc-700/70 bg-black/50 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
          >
            <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-zinc-600/70" />

            <h2
              className={`text-2xl md:text-3xl font-extrabold tracking-widest text-red-600 ${zeniqTech.className}`}
            >
              Sejarah & Biography
            </h2>
            <div className="mt-2 h-[1px] w-40 bg-zinc-700">
              <span className="block -mt-[1px] h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
            </div>

            <div
              className="mt-5 text-gray-300 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{
                __html:
                  historyText ||
                  `<p>Haircoolest Barbershop didirikan pada tahun 2010 dengan visi menghadirkan pengalaman grooming premium yang unik.
                  Sebagai barbershop pertama di Indonesia yang mengusung konsep Modern Metal Premium, Haircoolest telah menjadi ikon.</p>
                  <p>Dengan sentuhan modern dan nuansa metal yang khas, Haircoolest tidak hanya menawarkan potongan rambut, namun juga gaya hidup.</p>`,
              }}
            />

            <div className="mt-8">
              <h3
                className={`text-2xl md:text-3xl font-extrabold tracking-widest text-red-600 ${zeniqTech.className}`}
              >
                Disclaimer
              </h3>
              <div className="mt-2 h-[1px] w-40 bg-zinc-700">
                <span className="block -mt-[1px] h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
              </div>
              <div
                className="mt-5 text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    disclaimerText ||
                    `<p>Haircoolest Barbershop adalah <strong class="text-red-600">1st Modern Metal Premium Barbershop di Indonesia</strong> dan satu-satunya di dunia.</p>`,
                }}
              />
            </div>
          </motion.article>

          {/* Image block */}
          <motion.div variants={fadeIn} className="relative">
            <div className="relative aspect-square overflow-hidden border border-zinc-700/70 bg-black/40">
              <Image
                src={sanctuaryImage || "/placeholder.svg"}
                alt="Sejarah Haircoolest"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* glow sweep */}
              <span className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100 bg-gradient-to-r from-transparent via-red-600/10 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===================== PARA CAPSTERS ===================== */}
      <section className="pb-12 md:pb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full"
        >
          <motion.h2
            variants={fadeIn}
            className={`text-center text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-red-600 ${zeniqTech.className}`}
          >
            Para Capsters
          </motion.h2>
          <motion.div variants={fadeIn} className="w-screen overflow-hidden">
            <BarberSlider />
          </motion.div>
        </motion.div>
      </section>

      {/* ===================== GALLERY HASIL POTONGAN ===================== */}
      <section className="pb-12 md:pb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full"
        >
          <motion.h2
            variants={fadeIn}
            className={`text-center text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-red-600 ${zeniqTech.className}`}
          >
            Gallery Hasil Potongan
          </motion.h2>
          <motion.div variants={fadeIn} className="w-screen overflow-hidden">
            <OurWorkSlider onClick={handleOpenPopup} />
          </motion.div>
        </motion.div>
      </section>

      {/* ===================== VIDEO SECTION ===================== */}
      <VideoSection
        videoTitle={videoTitle}
        mainVideo={mainVideo}
        videoUrls={videos}
      />

      {/* ===================== OUR COLLABORATIONS ===================== */}
      <section className="bg-black pt-2 mb-12 md:mb-24">
        <div className="max-w-6xl mx-auto pb-4 px-4 md:px-8">
          <h2
            className={`text-3xl md:text-4xl font-bold text-red-600 text-center ${zeniqTech.className}`}
          >
            OUR COLLABORATIONS
          </h2>
        </div>
        <SponsorMarquee />
      </section>

      <Footer />

      {/* ===================== POPUP IMAGE (CYBER) ===================== */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={handleClosePopup}
        >
          <div
            className="relative w-[92%] max-w-4xl border border-zinc-700/70 bg-black/80 p-3 md:p-4 shadow-[0_0_24px_rgba(220,38,38,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Barber"
              className="w-full h-auto max-h-[80vh] object-cover"
            />
            <button
              onClick={handleClosePopup}
              className="absolute -top-3 -right-3 bg-red-600 text-white p-2 hover:bg-red-700 transition"
              aria-label="Tutup gambar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* corner brackets */}
            <span className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-zinc-600/70" />
          </div>
        </div>
      )}
    </div>
  );
}
