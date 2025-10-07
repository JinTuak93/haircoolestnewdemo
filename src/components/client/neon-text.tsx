import { zeniqTech } from "@/common/font";

type NeonTextProps = {
  children: React.ReactNode;
  colorClass?: string; // Tailwind text color class (e.g., 'text-blue-50')
  glow?: string; // CSS color for glow (e.g., '#60A5FA' or 'rgb(96,165,250)')
  size?: string; // Tailwind size classes
  className?: string;
};

const NeonText: React.FC<NeonTextProps> = ({
  children,
  colorClass = "text-blue-50",
  glow = "#60A5FA",
  size = "text-5xl md:text-7xl",
  className = "",
}) => {
  const shadow = `0 0 4px ${glow}, 0 0 8px ${glow}, 0 0 16px ${glow}, 0 0 32px ${glow}`;
  return (
    <span
      className={`${colorClass} ${size} ${zeniqTech.className} ${className}`}
      style={{ textShadow: shadow }}
    >
      {children}
    </span>
  );
};

export default NeonText;
