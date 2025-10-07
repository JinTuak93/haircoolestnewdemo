type ServicesCardProps = {
  name: string;
  desc: string;
  price: string;
};

export default function ServicesCard({ name, desc, price }: ServicesCardProps) {
  return (
    <div
      className="
        group relative w-full overflow-hidden
        border border-zinc-600/70 bg-transparent p-6
        transition-all duration-300
        hover:translate-y-[-2px] hover:shadow-[0_0_24px_rgba(220,38,38,0.25)]
        "
      aria-label={`${name} service card`}
    >
      {/* Border glow & animated edge sweep */}
      <div
        className="
          pointer-events-none absolute inset-0
          ring-1 ring-inset ring-zinc-600/60
          transition-colors duration-300
          group-hover:ring-red-600/60
        "
      />
      <div
        className="
          pointer-events-none absolute -inset-[1px]
          bg-gradient-to-r from-transparent via-red-600/15 to-transparent
          opacity-0 blur-[3px] transition-opacity duration-500
          group-hover:opacity-100
        "
      />
      {/* Subtle scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 2px, transparent 4px)",
        }}
      />

      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-zinc-600/70 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-zinc-600/70 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-zinc-600/70 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-zinc-600/70 group-hover:border-red-600/70" />

      {/* Header row */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2
          className="
            text-2xl font-extrabold uppercase tracking-widest text-red-600
            drop-shadow-[0_0_8px_rgba(220,38,38,0.35)]
          "
        >
          {name}
        </h2>

        {/* Price badge */}
        <div
          className="
            select-none border border-zinc-600/70 px-3 py-1 text-xs
            uppercase tracking-wider text-gray-300
            shadow-[inset_0_0_12px_rgba(220,38,38,0.15)]
            transition-colors duration-300
            group-hover:border-red-600/70
          "
          aria-label="price"
        >
          <span className="text-red-600">●</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-300/90">{desc}</p>

      {/* Bottom action rail (dummy; opsional) */}
      <div className="mt-6 flex items-center gap-3">
        <span className="inline-flex h-px flex-1 bg-zinc-600/60 group-hover:bg-red-600/60 transition-colors" />
        <span
          className="
            text-[10px] uppercase tracking-[0.2em] text-gray-300
            opacity-70
          "
        >
          Haircoolest
        </span>
        <span className="inline-flex h-px flex-1 bg-zinc-600/60 group-hover:bg-red-600/60 transition-colors" />
      </div>
    </div>
  );
}
