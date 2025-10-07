"use client";

import BarberCard from "@/components/card/barber";

import { Key, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { getBarbers } from "@/services/sanctuary";

import "swiper/css";

export default function BarberSlider() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [barbers, setBarbers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null); // Ref untuk mengakses instance Swiper

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const barbersData = await getBarbers();
        setBarbers(barbersData);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev(); // Navigasi ke slide sebelumnya
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext(); // Navigasi ke slide berikutnya
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (barbers.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-400">Belum ada data barber</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Swiper Container */}
      <Swiper
        ref={swiperRef} // Menyimpan instance Swiper ke ref
        direction="horizontal"
        slidesPerView={4}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          481: {
            slidesPerView: 4,
          },
        }}
        spaceBetween={0}
        modules={[Mousewheel]}
        className="mySwiper min-h-screen"
      >
        {barbers.map(
          (
            barber: { name: string; position: string; imageUrl: string },
            index: Key | null | undefined
          ) => (
            <SwiperSlide key={index}>
              <BarberCard barber={barber} />
            </SwiperSlide>
          )
        )}
      </Swiper>

      {/* Tombol Navigasi */}
      <button
        onClick={handlePrev}
        aria-label="Slide previous"
        className="cybr-nav left-2 md:left-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-8 md:w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {/* corner brackets */}
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Slide next"
        className="cybr-nav right-2 md:right-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-8 md:w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        {/* corner brackets */}
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
      </button>
      <style jsx>{`
        .cybr-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50; /* pastikan di atas Swiper */
          pointer-events: auto;
          height: 44px;
          width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(161, 161, 170, 0.7); /* zinc-600/70 */
          box-shadow: 0 0 18px rgba(220, 38, 38, 0.18);
          transition: transform 0.18s ease, border-color 0.25s ease,
            box-shadow 0.25s ease, background 0.25s ease;
        }
        @media (min-width: 768px) {
          .cybr-nav {
            height: 56px;
            width: 56px;
          }
        }

        /* glow sweep */
        .cybr-nav::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(220, 38, 38, 0.28),
            transparent
          );
          filter: blur(4px);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .cybr-nav:hover,
        .cybr-nav:focus-visible {
          border-color: rgba(220, 38, 38, 0.9); /* red-600/90 */
          box-shadow: 0 0 28px rgba(220, 38, 38, 0.36);
          transform: translateY(-50%) scale(1.03);
          background: rgba(0, 0, 0, 0.7);
          outline: none;
        }
        .cybr-nav:hover::before,
        .cybr-nav:focus-visible::before {
          opacity: 1;
        }

        /* corner brackets */
        .corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: rgba(161, 161, 170, 0.7);
        }
        .cybr-nav:hover .corner,
        .cybr-nav:focus-visible .corner {
          border-color: rgba(220, 38, 38, 0.9);
        }

        .corner.tl {
          left: 2px;
          top: 2px;
          border-left: 2px solid;
          border-top: 2px solid;
        }
        .corner.tr {
          right: 2px;
          top: 2px;
          border-right: 2px solid;
          border-top: 2px solid;
        }
        .corner.bl {
          left: 2px;
          bottom: 2px;
          border-left: 2px solid;
          border-bottom: 2px solid;
        }
        .corner.br {
          right: 2px;
          bottom: 2px;
          border-right: 2px solid;
          border-bottom: 2px solid;
        }
      `}</style>
    </div>
  );
}
