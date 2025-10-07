/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { zeniqTech } from "@/common/font";
import { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface VideoSectionProps {
  videoTitle?: string;
  mainVideo?: { id: string; url: string } | string | null;
  videoUrls?: { id: string; url: string }[];
}

export default function VideoSection({
  videoTitle,
  mainVideo,
  videoUrls,
}: VideoSectionProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const swiperRef = useRef<any>(null);

  const title = videoTitle || "Dari Momen Biasa, Jadi Luar Biasa!";
  const videos = videoUrls && videoUrls.length > 0 ? videoUrls : [];

  const formattedMainVideo = mainVideo
    ? typeof mainVideo === "string"
      ? { id: "main-video", url: mainVideo }
      : mainVideo
    : null;

  const featuredVideo =
    formattedMainVideo || (videos.length > 0 ? videos[0] : null);

  const sliderVideos = featuredVideo
    ? videos.filter((video) => video.id !== featuredVideo.id)
    : videos;

  const handleVideoClick = (videoId: string) => {
    const allVideos = [featuredVideo, ...sliderVideos].filter(Boolean) as {
      id: string;
      url: string;
    }[];

    allVideos.forEach((video) => {
      if (video && video.id !== videoId) {
        const other = document.getElementById(
          video.id
        ) as HTMLVideoElement | null;
        if (other) {
          other.pause();
          other.currentTime = 0;
        }
      }
    });

    const el = document.getElementById(videoId) as HTMLVideoElement | null;
    if (el) {
      if (el.paused) {
        el.play();
        setPlayingVideo(videoId);
      } else {
        el.pause();
        setPlayingVideo(null);
      }
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.swiper.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.swiper.slideNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate="visible"
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="px-4 md:px-8 pb-12 bg-black"
    >
      <div className="max-w-6xl mx-auto">
        <h1
          className={`text-4xl font-bold text-red-600 text-center mb-8 ${zeniqTech.className}`}
        >
          {title}
        </h1>

        {/* Main Featured Video */}
        {featuredVideo && (
          <div className="mb-8">
            <div
              className="cybr-frame relative cursor-pointer aspect-video w-full overflow-hidden"
              onClick={() => handleVideoClick(featuredVideo.id)}
            >
              {/* corner brackets */}
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />

              <video
                id={featuredVideo.id}
                className="w-full h-full object-cover"
                controls={false}
                loop
              >
                <source src={featuredVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Overlay dengan ikon play/pause (di bawah corner) */}
              {playingVideo !== featuredVideo.id && (
                <div className="absolute inset-0 z-[1] flex items-center justify-center bg-black/50">
                  <Image
                    src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495828/play-gray-red_ihyrf5.svg"
                    width={120}
                    height={120}
                    alt="Play button"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Slider */}
        {sliderVideos.length > 0 && (
          <div className="relative">
            <Swiper
              ref={swiperRef}
              slidesPerView={4}
              spaceBetween={16}
              modules={[Navigation]}
              breakpoints={{
                0: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="mySwiper"
            >
              {sliderVideos.map((video) => (
                <SwiperSlide key={video.id}>
                  <div
                    className="cybr-frame cybr-sm relative cursor-pointer overflow-hidden"
                    onClick={() => handleVideoClick(video.id)}
                  >
                    {/* corner brackets */}
                    <span className="corner tl" />
                    <span className="corner tr" />
                    <span className="corner bl" />
                    <span className="corner br" />

                    <video
                      id={video.id}
                      className="w-full h-auto"
                      controls={false}
                      loop
                    >
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {playingVideo !== video.id && (
                      <div className="absolute inset-0 z-[1] flex items-center justify-center bg-black/50">
                        <Image
                          src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495828/play-gray-red_ihyrf5.svg"
                          width={60}
                          height={60}
                          alt="Play button"
                        />
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons (tetap sama) */}
            {sliderVideos.length > 4 && (
              <>
                <button
                  onClick={handlePrev}
                  className="text-red-400 absolute top-1/2 left-0 z-10 transform -translate-y-1/2 bg-black/60 p-2 rounded-full shadow-lg hover:bg-black/80 transition"
                  aria-label="Previous videos"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
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
                </button>
                <button
                  onClick={handleNext}
                  className="text-red-400 absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-black/60 p-2 rounded-full shadow-lg hover:bg-black/80 transition"
                  aria-label="Next videos"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
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
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Styled-JSX: cyberpunk frame */}
      <style jsx>{`
        .cybr-frame {
          position: relative;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(161, 161, 170, 0.7); /* zinc-600/70 */
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 0 18px rgba(220, 38, 38, 0.18);
          transition: box-shadow 0.25s ease, border-color 0.25s ease,
            transform 0.18s ease;
        }
        .cybr-frame.cybr-sm {
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02) inset,
            0 0 12px rgba(220, 38, 38, 0.14);
        }

        /* rail glow atas-bawah */
        .cybr-frame::before,
        .cybr-frame::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(220, 38, 38, 0.7),
            transparent
          );
          z-index: 2;
        }
        .cybr-frame::before {
          top: 0;
        }
        .cybr-frame::after {
          bottom: 0;
        }

        /* hover intensify */
        .cybr-frame:hover {
          border-color: rgba(220, 38, 38, 0.9);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04) inset,
            0 0 28px rgba(220, 38, 38, 0.36);
          transform: translateZ(0) scale(1.003);
        }

        /* layering */
        .cybr-frame video {
          position: relative;
          z-index: 1;
        }

        /* corner brackets */
        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          z-index: 3;
          border-color: rgba(161, 161, 170, 0.7);
        }
        .cybr-frame:hover .corner {
          border-color: rgba(220, 38, 38, 0.9);
        }

        .corner.tl {
          left: 6px;
          top: 6px;
          border-left: 2px solid;
          border-top: 2px solid;
        }
        .corner.tr {
          right: 6px;
          top: 6px;
          border-right: 2px solid;
          border-top: 2px solid;
        }
        .corner.bl {
          left: 6px;
          bottom: 6px;
          border-left: 2px solid;
          border-bottom: 2px solid;
        }
        .corner.br {
          right: 6px;
          bottom: 6px;
          border-right: 2px solid;
          border-bottom: 2px solid;
        }
      `}</style>
    </motion.div>
  );
}
