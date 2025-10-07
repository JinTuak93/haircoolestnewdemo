/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zeniqNano, zeniqTech } from "@/common/font";
import Footer from "@/components/client/footer";
import data from "@/common/data";
import Image from "next/image";

// ===== Motion variants =====
const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// ===== Types =====
type ProductItem = {
  name: string;
  image: string;
  tokped?: string;
  shopee?: string;
};

// ====== Card building blocks (tanpa rounded) ======
function CyberFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        group relative border border-zinc-700/70 bg-black/55 p-5
        shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
        transition-all duration-300 hover:-translate-y-[2px]
        hover:shadow-[0_0_22px_rgba(220,38,38,0.18)]
        ${className}
      `}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-r from-transparent via-red-600/15 to-transparent" />
      <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 border-l-2 border-t-2 border-zinc-600/70 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute right-1 top-1 h-4 w-4 border-r-2 border-t-2 border-zinc-600/70 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute bottom-1 left-1 h-4 w-4 border-b-2 border-l-2 border-zinc-600/70 group-hover:border-red-600/70" />
      <span className="pointer-events-none absolute bottom-1 right-1 h-4 w-4 border-b-2 border-r-2 border-zinc-600/70 group-hover:border-red-600/70" />
      {children}
    </div>
  );
}

function ProductMedia({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mb-4 h-64 w-full border-b border-zinc-700/70 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        priority={false}
      />
    </div>
  );
}

function ProductHeader({ name }: { name: string }) {
  return (
    <h3
      className={`text-xl md:text-2xl font-extrabold tracking-widest text-red-600 ${zeniqTech.className}`}
    >
      {name}
    </h3>
  );
}

function BuyButton({
  onClick,
  className = "",
  children,
}: {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={`cybr-btn w-full mt-4 ${className}`}>
      {children}
    </button>
  );
}

function ProductCard({
  item,
  onBuy,
}: {
  item: ProductItem;
  onBuy: (p: ProductItem) => void;
}) {
  return (
    <CyberFrame>
      <ProductMedia src={item.image} alt={item.name} />
      <ProductHeader name={item.name} />
      <BuyButton onClick={() => onBuy(item)}>Buy Now</BuyButton>
    </CyberFrame>
  );
}

function PartnerCard({
  item,
  onBuy,
}: {
  item: ProductItem;
  onBuy: (p: ProductItem) => void;
}) {
  return (
    <CyberFrame className="bg-black/60">
      <ProductMedia src={item.image} alt={item.name} />
      <ProductHeader name={item.name} />
      <BuyButton onClick={() => onBuy(item)}>Buy Now</BuyButton>
    </CyberFrame>
  );
}

// ===== Page =====
export default function CloudLabPage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [dataProduct, setDataProduct] = useState<ProductItem | null>(null);

  const [title, setTitle] = useState(".CLOUD LAB");
  const [subtitle, setSubtitle] = useState("");
  const [headerImage, setHeaderImage] = useState<string>(
    "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495812/cloud_lab_nevnl7.jpg"
  );

  const [products, setProducts] = useState<ProductItem[]>(
    data.products?.map((p: any) => ({
      name: p.name,
      image: p.image,
      tokped: p.tokped,
      shopee: p.shopee,
    })) || []
  );
  const [partners, setPartners] = useState<ProductItem[]>(
    (data.parnertProduct || []).map((p: any) => ({
      name: p.name,
      image: p.image,
      tokped: p.tokped,
      shopee: p.shopee,
    }))
  );

  const [mounted, setMounted] = useState(false);
  const cancelRef = useRef(false);

  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") setPopupOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
      cancelRef.current = true;
    };
  }, [escFunction]);

  // Dynamic import services
  useEffect(() => {
    (async () => {
      try {
        const mod = await import("@/services/cloud-lab");
        const [t, s, h, ps, pr] = await Promise.all([
          mod.getTitle?.().catch(() => null),
          mod.getSubtitle?.().catch(() => null),
          mod.getHeaderImage?.().catch(() => null),
          mod.getProducts?.().catch(() => null),
          mod.getPartners?.().catch(() => null),
        ]);

        if (cancelRef.current) return;

        if (t) setTitle(t);
        if (s) setSubtitle(s);
        if (h) setHeaderImage(h);

        if (Array.isArray(ps) && ps.length) {
          setProducts(
            ps.map((x: any) => ({
              name: x.name,
              image: x.imageUrl,
              tokped: x.tokped,
              shopee: x.shopee,
            }))
          );
        }
        if (Array.isArray(pr) && pr.length) {
          setPartners(
            pr.map((x: any) => ({
              name: x.name,
              image: x.imageUrl,
              tokped: x.tokped,
              shopee: x.shopee,
            }))
          );
        }
      } catch (e) {
        console.error("Failed to load CloudLab CMS:", e);
      }
    })();
  }, []);

  // Decorative grid overlay (ringan)
  const gridBg = useMemo(
    () =>
      "bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.06),transparent_40%),repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_22px),repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_22px)]",
    []
  );

  const openBuy = (p: ProductItem) => {
    setDataProduct({
      ...p,
      tokped: p.tokped || "",
      shopee: p.shopee || "",
    });
    setPopupOpen(true);
  };

  return (
    <div className={`min-h-screen bg-black text-white ${gridBg} relative`}>
      {/* Ambient layers after mount */}
      {mounted && (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 opacity-[0.05] mix-blend-soft-light"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 2px, transparent 4px)",
            }}
          />
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35))]" />
        </>
      )}

      {/* ===== Header ===== */}
      <header className="relative flex h-[48vh] md:h-[60vh] items-center justify-center overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0">
          <Image
            src={headerImage}
            alt=".CLOUD LAB"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          {mounted && (
            <motion.div
              initial={{ x: "-40%" }}
              animate={{ x: "120%" }}
              transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
              className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-red-600/20 to-transparent"
            />
          )}
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-red-600 drop-shadow-[0_0_18px_rgba(220,38,38,0.35)] ${zeniqTech.className}`}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-gray-300 ${zeniqNano.className}`}
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto mt-6 h-[2px] w-48 md:w-64 bg-gradient-to-r from-transparent via-red-600/60 to-transparent"
          />
        </motion.div>

        <span className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-zinc-600/70" />
        <span className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-zinc-600/70" />
        <span className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-zinc-600/70" />
        <span className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-zinc-600/70" />
      </header>

      {/* ===== Our Product ===== */}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`mb-6 md:mb-8 text-center text-3xl md:text-4xl font-bold text-red-600 ${zeniqTech.className}`}
          >
            Our Product
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative mx-auto mb-6 h-[1px] w-44 md:w-56 bg-zinc-800"
          >
            <span className="absolute inset-x-0 -top-[1px] h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: ProductItem, idx: number) => (
              <motion.div
                key={`${product.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <ProductCard item={product} onBuy={openBuy} />
              </motion.div>
            ))}
            {!products.length && (
              <div className="col-span-full text-center text-neutral-400">
                Belum ada produk — segera tambahkan dari Dashboard.
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ===== Our Partner ===== */}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16 border-y border-zinc-800 bg-zinc-900/50 mb-8 md:mb-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`mb-8 text-center text-3xl md:text-4xl font-bold text-white ${zeniqTech.className}`}
          >
            Our Partner
          </motion.h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((product: ProductItem, idx: number) => (
              <motion.div
                key={`${product.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <PartnerCard item={product} onBuy={openBuy} />
              </motion.div>
            ))}
            {!partners.length && (
              <div className="col-span-full text-center text-neutral-400">
                Belum ada partner — segera tambahkan dari Dashboard.
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* ===== Popup ===== */}
      {popupOpen && dataProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative w-[92%] max-w-sm sm:max-w-md border border-zinc-700/70 bg-black/85 p-5 shadow-[0_0_22px_rgba(220,38,38,0.2)]"
            role="dialog"
            aria-modal="true"
          >
            <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 border-l-2 border-t-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute right-1 top-1 h-4 w-4 border-r-2 border-t-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute bottom-1 left-1 h-4 w-4 border-b-2 border-l-2 border-zinc-600/70" />
            <span className="pointer-events-none absolute bottom-1 right-1 h-4 w-4 border-b-2 border-r-2 border-zinc-600/70" />

            <button
              className="absolute right-4 top-3 text-white/80 transition hover:text-red-600 focus:outline-none"
              onClick={() => setPopupOpen(false)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <h1
              className={`mt-1 text-center text-2xl font-bold ${zeniqTech.className}`}
            >
              BELI MELALUI
            </h1>

            <div className="mx-auto mt-5 grid grid-cols-2 gap-4">
              <a
                href={dataProduct.shopee || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center border border-zinc-700/70 bg-black/40 p-3 transition hover:border-red-600/70"
              >
                <img
                  src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495831/shopee_tz7azk.png"
                  alt="Shopee"
                  className="h-16"
                />
              </a>

              <a
                href={dataProduct.tokped || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center border border-zinc-700/70 bg-black/40 p-3 transition hover:border-red-600/70"
              >
                <img
                  src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495834/tokopedia_jp8fso.png"
                  alt="Tokopedia"
                  className="h-16"
                />
              </a>
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/20" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                Atau
              </span>
              <span className="h-px flex-1 bg-white/20" />
            </div>

            <p
              className={`text-center text-sm text-gray-200 ${zeniqNano.className}`}
            >
              Melalui WHATSAPP:
            </p>
            <a
              href={`${data.whatsapp}?text=${encodeURIComponent(
                `Hai, saya ingin membeli ${dataProduct.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex justify-center"
            >
              <img
                src="https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495834/wa_xxlgih.png"
                alt="Whatsapp"
                className="h-16"
              />
            </a>
          </motion.div>
        </div>
      )}

      {/* ===== Local styles: tombol cyberpunk ===== */}
      <style jsx>{`
        .cybr-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(161, 161, 170, 0.7);
          background: rgba(0, 0, 0, 0.6);
          padding: 0.75rem 1rem;
          border-radius: 0;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: white;
          transition: box-shadow 0.25s ease, border-color 0.25s ease,
            transform 0.25s ease;
          backdrop-filter: blur(6px);
          box-shadow: 0 0 18px rgba(220, 38, 38, 0.15);
        }
        .cybr-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(220, 38, 38, 0.2),
            transparent
          );
          filter: blur(3px);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .cybr-btn:hover {
          border-color: rgba(220, 38, 38, 0.7);
          box-shadow: 0 0 28px rgba(220, 38, 38, 0.35);
          transform: translateY(-1px);
        }
        .cybr-btn:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
