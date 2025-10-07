"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function MusicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const audio = audioRef.current;

    // Bersihkan saat meninggalkan "/"
    if (pathname !== "/") {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      return; // jangan pasang listener apa pun di luar "/"
    }

    // Hanya di "/": play setelah user gesture (kebijakan autoplay)
    const handleUserGesture = () => {
      if (audio) {
        audio
          .play()
          .catch((err) =>
            console.log("Autoplay failed after interaction:", err)
          );
      }
      document.removeEventListener("click", handleUserGesture);
      document.removeEventListener("keydown", handleUserGesture);
    };

    document.addEventListener("click", handleUserGesture);
    document.addEventListener("keydown", handleUserGesture);

    // Cleanup saat unmount atau pindah halaman
    return () => {
      document.removeEventListener("click", handleUserGesture);
      document.removeEventListener("keydown", handleUserGesture);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [pathname]);

  return (
    <>
      {/* Render audio hanya di "/" */}
      {pathname === "/" && (
        <audio ref={audioRef} loop preload="auto">
          <source src="/assets/song.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {children}
    </>
  );
}
