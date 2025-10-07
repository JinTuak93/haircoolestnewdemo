import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanctuary | Haircoolest",
  description: "",
};

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
