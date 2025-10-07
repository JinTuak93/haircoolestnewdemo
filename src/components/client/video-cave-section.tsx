"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import NeonText from "./neon-text";
import Image from "next/image";

export default function VideoCaveSection() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handleVideoClick = (videoId: string) => {
    const el = document.getElementById(videoId) as HTMLVideoElement | null;
    if (!el) return;
    const otherId = videoId === "video1" ? "video2" : "video1";
    const other = document.getElementById(otherId) as HTMLVideoElement | null;
    if (other) {
      other.pause();
      other.currentTime = 0;
    }
    if (el.paused) {
      el.play();
      setPlayingVideo(videoId);
    } else {
      el.pause();
      setPlayingVideo(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-8 pt-12 pb-4 bg-transparent"
    >
      <div className="mb-8 text-center">
        <NeonText size="text-4xl" glow="#60A5FA" colorClass="text-blue-50">
          Boom Our New Cave Stories
        </NeonText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {["video1", "video2"].map((id, i) => (
          <div
            key={id}
            className="relative cursor-pointer rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.25)]"
            onClick={() => handleVideoClick(id)}
          >
            <video
              id={id}
              className="w-full h-auto"
              loop
              playsInline
              preload="metadata"
            >
              <source
                src={
                  i === 0
                    ? "https://res.cloudinary.com/dns2kdqbi/video/upload/v1743495851/3_rhz3ln.mp4"
                    : "https://res.cloudinary.com/dns2kdqbi/video/upload/v1743495847/4_rgyxqd.mp4"
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Overlay play icon */}
            {playingVideo !== id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                <Image
                  src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495828/play-gray-red_ihyrf5.svg"
                  width={100}
                  height={100}
                  alt=""
                  className="invert hue-rotate-180"
                />
              </div>
            )}

            {/* Glow ring */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
