import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ".CLOUD LAB | Haircoolest",
  description: "",
};

export default function CloudLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
