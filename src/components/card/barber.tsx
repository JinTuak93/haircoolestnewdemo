/* eslint-disable @next/next/no-img-element */

type BarberCardProps = {
  name: string;
  position: string;
  imageUrl: string;
};

export default function BarberCard({ barber }: { barber: BarberCardProps }) {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <img
        src={barber.imageUrl}
        alt="Barber"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <p className="text-red-600 text-8xl font-bold font-ruthie">
          {barber.name}
        </p>
        <p className="text-lg">{barber.position}</p>
      </div>
    </div>
  );
}
