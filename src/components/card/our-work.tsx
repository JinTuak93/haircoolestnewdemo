/* eslint-disable @next/next/no-img-element */
"use client";

type OurWorkCardProps = {
  imageUrl: string;
  onClick: (imageUrl: string) => void; // Prop untuk menangani klik card
};

export default function OurWorkCard({ imageUrl, onClick }: OurWorkCardProps) {
  return (
    <div
      className="w-full h-screen overflow-hidden flex items-center justify-center cursor-pointer"
      onClick={() => onClick(imageUrl)} // Panggil fungsi onClick dengan imageUrl
    >
      <img
        src={imageUrl}
        alt="Barber"
        className="w-full h-full object-cover transition-all duration-500 filter grayscale hover:filter-none"
      />
    </div>
  );
}
