"use client";

import { useEffect, useState } from "react";
import { getAwards } from "@/services/sanctuary";
import Image from "next/image";
import Marquee from "react-fast-marquee";

type Award = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function SponsorMarquee({
  className = "",
}: {
  className?: string;
}) {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const awardsData = await getAwards();
        setAwards(awardsData || []);
      } catch (error) {
        console.error("Error fetching awards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  if (loading) return <SkeletonRow />;

  if (!awards.length) {
    return (
      <div className="flex justify-center items-center h-24 text-gray-400">
        Belum ada data OUR COLLABORATIONS
      </div>
    );
  }

  // Bagi 2 untuk desktop: 2 baris saling berlawanan arah.
  const rowA = awards.filter((_, i) => i % 2 === 0);
  const rowB = awards.filter((_, i) => i % 2 !== 0);

  return (
    <div className={`relative ${className}`}>
      {/* rail glow atas/bawah */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-[1px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-[1px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />

      {/* Mobile: satu baris */}
      <div className="md:hidden">
        <NeonMarquee items={awards} direction="left" speed={40} />
      </div>

      {/* Desktop: dua baris */}
      <div className="hidden md:flex md:flex-col md:gap-6">
        <NeonMarquee items={awards} direction="left" speed={50} />
        {/* <NeonMarquee items={rowA} direction="left" speed={50} />
        <NeonMarquee items={rowB} direction="right" speed={46} /> */}
      </div>
    </div>
  );
}

function NeonMarquee({
  items,
  direction = "left",
  speed = 45,
}: {
  items: Award[];
  direction?: "left" | "right";
  speed?: number;
}) {
  return (
    <Marquee
      pauseOnHover
      gradient
      gradientColor="#000000"
      gradientWidth={60}
      direction={direction}
      speed={speed}
      className="overflow-hidden py-4 md:py-8"
    >
      {items.map((award) => (
        <div key={award.id} className="group mx-4">
          <div
            className="
              relative w-[180px] h-[104px]
              border border-zinc-700/70 bg-black/50
              flex items-center justify-center
              shadow-[0_0_16px_rgba(220,38,38,0.12)]
              transition-transform duration-300
              hover:-translate-y-0.5
            "
          >
            {/* image */}
            <Image
              src={award.imageUrl || "/placeholder.svg"}
              alt={award.name}
              width={160}
              height={72}
              sizes="180px"
              className="max-h-[72px] w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* sweep glow */}
            <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-red-600/12 to-transparent" />

            {/* corner brackets */}
            <span className="pointer-events-none absolute left-1 top-1 h-3 w-3 border-l-2 border-t-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute right-1 top-1 h-3 w-3 border-r-2 border-t-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute left-1 bottom-1 h-3 w-3 border-l-2 border-b-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute right-1 bottom-1 h-3 w-3 border-r-2 border-b-2 border-zinc-600/70" />
          </div>

          {/* label */}
          <p className="mt-2 text-center text-xs text-white/80">{award.name}</p>
        </div>
      ))}
    </Marquee>
  );
}

function SkeletonRow() {
  return (
    <div className="relative py-6">
      <div className="flex gap-6 overflow-hidden justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="
              w-[180px] h-[104px]
              bg-zinc-900/60 border border-zinc-800
              animate-pulse
            "
          />
        ))}
      </div>
    </div>
  );
}
