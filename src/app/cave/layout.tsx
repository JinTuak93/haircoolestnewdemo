import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Cave | Haircoolest",
  description: "",
};

export default function CaveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
