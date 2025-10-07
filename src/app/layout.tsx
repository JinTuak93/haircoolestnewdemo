import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { zeniq } from "@/common/font";
import NextTopLoader from "nextjs-toploader";
import MusicProvider from "@/common/music-provider";
import NavigationBar from "@/components/client/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haven | Haircoolest",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="scroll-smooth no-scrollbar"
      style={{ scrollBehavior: "smooth" }}
      suppressHydrationWarning
    >
      <body className={`${zeniq.className} antialiased bg-black text-white`}>
        <MusicProvider>
          <NextTopLoader color="#e53935" showSpinner={false} />
          <NavigationBar />
          {children}
          <Toaster position="bottom-center" />
        </MusicProvider>
      </body>
    </html>
  );
}
