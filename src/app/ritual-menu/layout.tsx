import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ritual Menu's | Haircoolest",
  description: "",
};

export default function RitualMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
