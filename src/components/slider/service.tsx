"use client";

import data from "@/common/data";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { Mousewheel } from "swiper/modules";
import ServicesCard from "@/components/card/services";
import "swiper/css";

function CyberNavButton({
  side,
  onClick,
  className = "",
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  className?: string;
  label: string;
}) {
  const isLeft = side === "left";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        group absolute z-20 -translate-y-1/2
        ${isLeft ? "left-3 sm:left-4" : "right-3 sm:right-4"}
        top-1/2 h-12 w-12 sm:h-14 sm:w-14
        grid place-items-center
        border border-zinc-600/70 bg-black/60 backdrop-blur
        shadow-[0_0_18px_rgba(220,38,38,0.15)]
        transition-all duration-300
        hover:shadow-[0_0_28px_rgba(220,38,38,0.35)]
        hover:border-red-600/70
        focus:outline-none focus:ring-2 focus:ring-red-600/60
        ${className}
      `}
    >
      {/* corner brackets */}
      <span className="pointer-events-none absolute left-1 top-1 h-3 w-3 border-l-2 border-t-2 border-zinc-600/60 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute right-1 top-1 h-3 w-3 border-r-2 border-t-2 border-zinc-600/60 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 border-zinc-600/60 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-zinc-600/60 group-hover:border-red-600/70" />
      {/* neon sweep */}
      <span className="pointer-events-none absolute inset-0 opacity-0 blur-[3px] transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
      {/* scanlines */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 2px, transparent 4px)",
        }}
      />
      {/* icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {isLeft ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export default function ServiceSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <div className="relative">
      {/* Nav buttons (cyberpunk) */}
      <CyberNavButton
        side="left"
        onClick={handlePrev}
        label="Previous services"
      />
      <CyberNavButton side="right" onClick={handleNext} label="Next services" />

      <Swiper
        onSwiper={(inst) => (swiperRef.current = inst)}
        direction="horizontal"
        loop
        // Responsiveness: mobile peek + centered; scale up on larger screens
        centeredSlides
        grabCursor
        mousewheel={{ forceToAxis: true, sensitivity: 0.6 }}
        spaceBetween={12}
        slidesPerView={1.1}
        breakpoints={{
          380: { slidesPerView: 1.2, spaceBetween: 14 },
          480: { slidesPerView: 1.4, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 2.5, spaceBetween: 18 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 24, centeredSlides: false },
        }}
        modules={[Mousewheel]}
        className="mySwiper"
      >
        {data.services.map((service, index) => (
          <SwiperSlide key={index} className="px-1 py-3 sm:px-2 sm:py-4">
            <ServicesCard
              name={service.name}
              desc={service.description}
              price=""
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* bottom cyber rail (opsional, purely visual) */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-[2px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent blur-[1px]" />
    </div>
  );
}
