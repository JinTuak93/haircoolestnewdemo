"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Academy() {
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
                <h1 className="text-4xl font-bold text-white mb-4">
                  Segera <span className="text-red-600">Hadir</span>
                </h1>

                {/* Deskripsi */}
                <p className="text-lg text-gray-300 mb-8">
                  Kami sedang mempersiapkan sesuatu yang spesial untuk Anda.
                  Pantau terus perkembangan kami!
                </p>

                {/* Garis Pembatas */}
                <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>

                {/* Kontak */}
                <div className="space-y-2">
                  <p className="text-gray-300">Untuk informasi lebih lanjut:</p>
                  <a
                    href="mailto:info@brandanda.com"
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    contact@haircoolest.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    // <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
    //   {/* Background Video dengan Overlay */}
    //   <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
    //     <motion.div
    //       initial={{
    //         scale: 0,
    //         x: "-50%",
    //         y: "-50%",
    //         originX: 0,
    //         originY: 0,
    //       }}
    //       animate={{
    //         scale: 1,
    //         x: "0%",
    //         y: "0%",
    //         originX: 0,
    //         originY: 0,
    //       }}
    //       transition={{
    //         duration: 2,
    //         ease: [0.22, 1, 0.36, 1], // smooth spring
    //       }}
    //       className="w-full h-full"
    //       style={{ originX: 0, originY: 0 }}
    //     >
    //       <video
    //         ref={videoRef}
    //         className="w-full h-full object-cover filter grayscale"
    //         autoPlay
    //         loop
    //         muted
    //         playsInline
    //       >
    //         <source src="/assets/background-video.mp4" type="video/mp4" />
    //         {/* Fallback image jika video tidak bisa dimuat */}
    //         <div className="absolute inset-0 w-full h-full bg-[url('/assets/background.jpeg')] bg-no-repeat bg-center bg-cover"></div>
    //       </video>
    //     </motion.div>
    //     <div className="absolute inset-0 bg-black/80 to-transparent"></div>
    //   </div>
    //   <div className="max-w-md mx-auto z-10">
    //     {/* Judul */}
    //     <h1 className="text-4xl font-bold text-white mb-4">
    //       Segera <span className="text-red-600">Hadir</span>
    //     </h1>

    //     {/* Deskripsi */}
    //     <p className="text-lg text-gray-300 mb-8">
    //       Kami sedang mempersiapkan sesuatu yang spesial untuk Anda. Pantau
    //       terus perkembangan kami!
    //     </p>

    //     {/* Garis Pembatas */}
    //     <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>

    //     {/* Kontak */}
    //     <div className="space-y-2">
    //       <p className="text-gray-300">Untuk informasi lebih lanjut:</p>
    //       <a
    //         href="mailto:info@brandanda.com"
    //         className="text-red-600 hover:text-red-800 font-medium"
    //       >
    //         contact@haircoolest.com
    //       </a>
    //     </div>
    //   </div>
    // </div>
  );
}
