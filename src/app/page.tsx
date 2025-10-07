"use client";

import { useEffect, useRef } from "react";
import { zeniqTech } from "@/common/font";
import { motion } from "framer-motion";
import Footer from "@/components/client/footer";

export default function Haven() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      // Jika video selesai (atau hampir selesai), set kembali ke detik ke-9
      if (video.currentTime >= video.duration - 0.5) {
        video.currentTime = 9;
      }
    };

    const handleLoadedMetadata = () => {
      // Set mulai dari detik ke-9 saat metadata dimuat
      video.currentTime = 9;
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Pastikan video dimulai
    video.play().catch((error) => {
      console.log("Autoplay prevented:", error);
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Video dengan Overlay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <motion.div
            initial={{
              scale: 0,
              x: "-50%",
              y: "-50%",
              originX: 0,
              originY: 0,
            }}
            animate={{
              scale: 1,
              x: "0%",
              y: "0%",
              originX: 0,
              originY: 0,
            }}
            transition={{
              duration: 2,
              ease: [0.22, 1, 0.36, 1], // smooth spring
            }}
            className="w-full h-full"
            style={{ originX: 0, originY: 0 }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover filter grayscale"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src="https://res.cloudinary.com/dns2kdqbi/video/upload/v1751477644/background-video_nijwqp.mp4"
                type="video/mp4"
              />
              {/* Fallback image jika video tidak bisa dimuat */}
              <div className="absolute inset-0 w-full h-full bg-[url('/assets/background.jpeg')] bg-no-repeat bg-center bg-cover"></div>
            </video>
            <div className="absolute inset-0 bg-black/80 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen">
              <div className="relative z-0 flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1
                  className={`text-2xl md:text-6xl font-medium flex flex-col md:flex-row items-center ${zeniqTech.className}`}
                >
                  Urusan rambut
                  <span className="text-red-600 font-semibold text-2xl md:text-6xl px-4">
                    Haircoolest
                  </span>
                  Jagonya!
                </h1>
                <p
                  className={`mt-2 text-sm md:text-xl text-gray-400 ${zeniqTech.className}`}
                >
                  1st Modern Metal Premium Barbershop di Indonesia dan
                  satu-satunya di dunia
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 md:z-0 mt-auto">
        <Footer />
      </div>
    </div>
  );
}
