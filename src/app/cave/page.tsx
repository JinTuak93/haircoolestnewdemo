/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { zeniqTech } from "@/common/font";
import Footer from "@/components/client/footer";
import NeonText from "@/components/client/neon-text";
import VideoCaveSection from "@/components/client/video-cave-section";
import Image from "next/image";
import Link from "next/link";
import { Tabs } from "@/components/client/tabs";

/* ================== Motion ================== */
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};
const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/* ================== Types ================== */
type PlaygroundItem = { title: string; image: string };

type MenuCategory = {
  id: string;
  title: string;
  order?: number;
  // legacy support (old shape had items inline)
  items?: Array<{
    name: string;
    description?: string;
    image?: string;
    imageUrl?: string;
  }>;
};

type MenuItem = {
  id?: string;
  categoryId: string;
  name: string;
  description?: string;
  imageUrl: string;
};

type EventT = {
  id: string;
  title: string;
  date?: string; // ISO string
  location?: string;
  imageUrl?: string;
  description?: string;
  linkUrl?: string;
};

/* ================== Defaults (render-first) ================== */
const defaultHeaderImage =
  "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495812/cave_oyho6r.jpg";

const defaultBio = {
  title: "Bio",
  text:
    "Cave Haircoolest adalah tempat nongkrong eksklusif dengan nuansa modern yang vibrant. " +
    "Kami menggabungkan konsep barbershop dan cafe untuk memberikan pengalaman yang unik.",
  image:
    "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495811/cave-logo_vxj0rz.png",
  tagline: "Pantang Pulang Sebelum Kenyang",
};

const defaultPlayground: PlaygroundItem[] = [
  {
    title: "Play Station",
    image:
      "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495811/playstation_egqckg.jpg",
  },
  {
    title: "Game Arcade",
    image:
      "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495811/game_arcade_xyudd6.webp",
  },
];

const defaultGallery = [
  "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495811/1_bt3bao.jpg",
  "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495811/2_y6ctgc.jpg",
  "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495811/3_fyhlgm.jpg",
];

/* ================== Helpers ================== */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
function fmtDate(d?: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

/* ================== Page ================== */
export default function OurCave() {
  const [mounted, setMounted] = useState(false);
  const cancelRef = useRef(false);

  // Header
  const [title, setTitle] = useState("Cave Haircoolest");
  const [subtitle, setSubtitle] = useState("");
  const [headerImage, setHeaderImage] = useState(defaultHeaderImage);

  // Bio
  const [bioTitle, setBioTitle] = useState(defaultBio.title);
  const [bioText, setBioText] = useState(defaultBio.text);
  const [bioImage, setBioImage] = useState(defaultBio.image);
  const [bioTagline, setBioTagline] = useState(defaultBio.tagline);

  // Disclaimer
  const [disclaimerText, setDisclaimerText] = useState(
    "Cave Haircoolest adalah 1st Dystopian Modern Metal Cafe di Indonesia. Tempat ini tidak hanya tentang makanan, tetapi juga tentang pengalaman yang tak terlupakan."
  );

  // Playground, Gallery
  const [playground, setPlayground] =
    useState<PlaygroundItem[]>(defaultPlayground);
  const [gallery, setGallery] = useState<string[]>(defaultGallery);

  // ============ MENU (categories + items dipisah, lalu di-merge) ============
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // ============ EVENTS ============
  const [events, setEvents] = useState<EventT[]>([]);

  // Dynamic import services (hindari SSR mismatch)
  useEffect(() => {
    setMounted(true);
    (async () => {
      try {
        const mod: any = await import("@/services/cave");

        const [
          t,
          s,
          h,
          bio_title,
          bio_text,
          bio_img,
          bio_tag,
          disc,
          pg,
          gal,
          cats,
          items,
          evs,
        ] = await Promise.all([
          mod.getTitle?.().catch(() => null),
          mod.getSubtitle?.().catch(() => null),
          mod.getHeaderImage?.().catch(() => null),

          mod.getBioTitle?.().catch(() => null),
          mod.getBioText?.().catch(() => null),
          mod.getBioImage?.().catch(() => null),
          mod.getBioTagline?.().catch(() => null),

          mod.getDisclaimerText?.().catch(() => null),

          mod.getPlaygroundItems?.().catch(() => null),
          mod.getGalleryImages?.().catch(() => null),

          mod.getMenuCategories?.().catch(() => null), // [{id,name/title,order}]
          mod.getMenuItems?.().catch(() => null), // [{id,categoryId,name,description,imageUrl}]

          mod.getEvents?.().catch(() => null), // [{...EventT}]
        ]);

        if (cancelRef.current) return;

        if (t) setTitle(t);
        if (s) setSubtitle(s);
        if (h) setHeaderImage(h);

        if (bio_title) setBioTitle(bio_title);
        if (bio_text) setBioText(bio_text);
        if (bio_img) setBioImage(bio_img);
        if (bio_tag) setBioTagline(bio_tag);

        if (disc) setDisclaimerText(disc);

        if (Array.isArray(pg) && pg.length) {
          setPlayground(
            pg.map((x: any) => ({
              title: x.title || x.name || "Playground",
              image: x.image || x.imageUrl || "",
            }))
          );
        }

        if (Array.isArray(gal) && gal.length) {
          const urls = gal.map((g: any) => g?.imageUrl || g).filter(Boolean);
          if (urls.length) setGallery(urls);
        }

        // ============ MENU: normalisasi ============
        if (Array.isArray(cats) && cats.length) {
          const normCats: MenuCategory[] = cats
            .map((c: any) => ({
              id: c.id || slugify(c.title || c.name || "menu"),
              title: c.title || c.name || "Menu",
              order: typeof c.order === "number" ? c.order : 0,
              items: Array.isArray(c.items) ? c.items : undefined, // legacy support
            }))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setCategories(normCats);
        } else {
          setCategories([]);
        }

        if (Array.isArray(items)) {
          const normItems: MenuItem[] = items.map((it: any) => ({
            id: it.id,
            categoryId: it.categoryId || it.category?.id || "",
            name: it.name || "Menu Item",
            description: it.description || "",
            imageUrl: it.imageUrl || it.image || "",
          }));
          setMenuItems(normItems);
        } else {
          setMenuItems([]);
        }

        // ============ EVENTS: normalisasi ============
        if (Array.isArray(evs)) {
          const normEvs: EventT[] = evs.map((e: any) => ({
            id: e.id,
            title: e.title || "Event",
            date: e.date || e.datetime || undefined,
            location: e.location || "",
            imageUrl: e.imageUrl || e.image || "",
            description: e.description || "",
            linkUrl: e.linkUrl || e.url || "",
          }));
          setEvents(normEvs);
        }
      } catch (e) {
        console.error("[Cave] load CMS failed:", e);
      }
    })();

    return () => {
      cancelRef.current = true;
    };
  }, []);

  // Background disco
  const discoBg = useMemo(
    () =>
      "bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(900px_500px_at_10%_10%,rgba(56,189,248,0.2),transparent),linear-gradient(180deg,rgba(2,6,23,1),rgba(2,6,23,1))]",
    []
  );

  // Build Tabs dari categories (+ merge items by categoryId)
  const tabsData = useMemo(() => {
    // path 1: punya items terpisah dari DB
    if (categories.length && menuItems.length) {
      return categories.map((cat) => {
        const itemsOfCat = menuItems.filter(
          (m) => (m.categoryId || "").toString() === (cat.id || "").toString()
        );
        return {
          title: cat.title,
          value: cat.id || slugify(cat.title),
          content: (
            <div className="p-4 md:p-8 rounded-xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                {itemsOfCat.map((item, idx) => (
                  <div
                    key={`${cat.id}-${item.id ?? idx}`}
                    className="rounded-xl overflow-hidden group"
                  >
                    <div className="relative h-64">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="px-4 py-5 bg-white/5">
                      <h3
                        className={`text-xl font-bold text-white ${zeniqTech.className}`}
                      >
                        {item.name}
                      </h3>
                      {item.description ? (
                        <p className="hidden md:block text-blue-100/80 mt-2">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
                {!itemsOfCat.length && (
                  <div className="col-span-full text-center text-blue-100/70">
                    Belum ada item pada kategori ini.
                  </div>
                )}
              </div>
            </div>
          ),
        };
      });
    }

    // path 2 (legacy): categories sudah berisi items inline
    if (categories.length && categories.some((c) => Array.isArray(c.items))) {
      return categories.map((cat) => ({
        title: cat.title,
        value: cat.id || slugify(cat.title),
        content: (
          <div className="p-4 md:p-8 rounded-xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {(cat.items || []).map((item, idx) => (
                <div
                  key={`${cat.id}-legacy-${idx}`}
                  className="rounded-xl overflow-hidden group"
                >
                  <div className="relative h-64">
                    <Image
                      src={(item.imageUrl || item.image) ?? "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="px-4 py-5 bg-white/5">
                    <h3
                      className={`text-xl font-bold text-white ${zeniqTech.className}`}
                    >
                      {item.name}
                    </h3>
                    {item.description ? (
                      <p className="hidden md:block text-blue-100/80 mt-2">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
              {!cat.items?.length && (
                <div className="col-span-full text-center text-blue-100/70">
                  Belum ada item pada kategori ini.
                </div>
              )}
            </div>
          </div>
        ),
      }));
    }

    // path 3: fallback (tanpa data)
    return [];
  }, [categories, menuItems]);

  // ============ EVENTS: Tabs data ============
  const eventTabs = useMemo(() => {
    if (!events.length) return [];

    return events.map((ev) => ({
      title: ev.title,
      value: ev.id || slugify(ev.title),
      content: (
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
          {/* background image */}
          <div className="absolute inset-0">
            <Image
              src={ev.imageUrl || "https://placehold.co/1600x900?text=Event"}
              alt={ev.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
            {/* blue glow + dark gradient to improve readability */}
            <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_10%,rgba(56,189,248,0.25),transparent)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#0b1220]/40 to-transparent" />
          </div>

          {/* content on top */}
          <div className="relative p-6 md:p-10">
            <h3
              className={`text-2xl md:text-3xl font-extrabold text-white drop-shadow ${zeniqTech.className}`}
            >
              {ev.title}
            </h3>
            <p className="mt-2 text-blue-100/90">
              {fmtDate(ev.date)}
              {ev.location ? ` • ${ev.location}` : ""}
            </p>

            {ev.description ? (
              <p className="mt-4 max-w-3xl text-blue-50/90 leading-relaxed">
                {ev.description}
              </p>
            ) : null}
          </div>
        </div>
      ),
    }));
  }, [events]);

  return (
    <div className={`min-h-screen text-white ${discoBg}`}>
      {/* ========== HEADER ========== */}
      <header className="relative h-[48vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={headerImage}
            alt="Cave Haircoolest"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          {mounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_55%)]"
            />
          )}
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <NeonText
              glow="#60A5FA"
              colorClass="text-blue-50"
              size="text-5xl md:text-7xl"
            >
              {title}
            </NeonText>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-base md:text-xl text-blue-100/80 mt-4"
          >
            {subtitle}
          </motion.p>
          <motion.div
            variants={fadeIn}
            className="mx-auto mt-6 h-[2px] w-48 md:w-64 bg-gradient-to-r from-transparent via-sky-400/70 to-transparent blur-[1px]"
          />
        </motion.div>
      </header>

      {/* ========== BIO ========== */}
      <section className="py-20 px-4 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div className="relative h-72">
              <div className="absolute -inset-2 bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-transparent blur-xl" />
              <Image
                src={bioImage}
                alt="Bio Cave Haircoolest"
                width={360}
                height={360}
                className="object-contain relative z-10"
              />
            </div>
            <div>
              <NeonText
                glow="#60A5FA"
                colorClass="text-blue-50"
                size="text-4xl"
              >
                {bioTitle}
              </NeonText>
              <p className="text-blue-100/85 mt-4 mb-4">{bioText}</p>
              <NeonText
                glow="#93C5FD"
                colorClass="text-blue-50"
                size="text-xl md:text-2xl"
              >
                {bioTagline}
              </NeonText>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========== DISCLAIMER ========== */}
      <section className="py-14 px-4 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_0_40px_rgba(59,130,246,0.25)] p-8 md:p-12">
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 text-white text-center ${zeniqTech.className}`}
            >
              Disclaimer
            </h2>
            <p className="text-center text-blue-100/90">{disclaimerText}</p>
          </div>
        </motion.div>
      </section>

      {/* ========== PLAYGROUND ========== */}
      <section className="py-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <NeonText glow="#60A5FA" colorClass="text-blue-50" size="text-5xl">
            Playground
          </NeonText>
        </motion.div>

        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8">
          {playground.map((p, idx) => (
            <motion.div
              key={`${p.title}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="space-y-3"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={p.image}
                  alt={p.title}
                  width={1600}
                  height={900}
                  className="object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-white/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <h3 className="text-2xl">{p.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== MENU (Tabs) ========== */}
      <section className="py-16 px-4 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto"
        >
          <div className="mb-8 text-center">
            <NeonText glow="#60A5FA" colorClass="text-blue-50" size="text-5xl">
              Food Menu
            </NeonText>
          </div>

          {tabsData.length ? (
            // @ts-ignore - komponen Tabs milikmu menerima props {tabs}
            <Tabs
              tabs={tabsData}
              containerClassName="justify-center gap-2 md:gap-3"
              tabClassName="rounded-full text-sm md:text-base"
              activeTabClassName="!bg-sky-500/40 !ring-1 !ring-sky-300/50"
              contentClassName="mt-6"
            />
          ) : (
            <div className="text-center text-blue-100/80">
              Belum ada kategori menu.
            </div>
          )}
        </motion.div>
      </section>

      {/* ========== GALLERY ========== */}
      <section className="pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-8 text-center"
          >
            <NeonText glow="#60A5FA" colorClass="text-blue-50" size="text-5xl">
              Gallery Ambience
            </NeonText>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.map((image, index) => (
              <motion.div
                key={`${image}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative h-80 overflow-hidden rounded-2xl ring-1 ring-white/10"
              >
                <Image
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VIDEO ========== */}
      <VideoCaveSection />

      {/* ========== EVENTS (Tabs) ========== */}
      <section className="py-16 px-4 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8 text-center">
            <NeonText glow="#60A5FA" colorClass="text-blue-50" size="text-5xl">
              Events
            </NeonText>
          </div>

          {eventTabs.length ? (
            // @ts-ignore - komponen Tabs milikmu menerima props {tabs}
            <Tabs
              tabs={eventTabs}
              containerClassName="justify-center gap-2 md:gap-3"
              tabClassName="rounded-full text-sm md:text-base"
              activeTabClassName="!bg-sky-500/40 !ring-1 !ring-sky-300/50"
              contentClassName="mt-6"
            />
          ) : (
            <div className="max-w-6xl mx-auto text-center">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 text-white ${zeniqTech.className}`}
              >
                Coming Soon
              </h2>
              <p className="text-blue-100/90">
                Event Cave Haircoolest akan segera hadir. Stay tuned!
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* ========== TAGLINE ========== */}
      <section className="py-16 px-4 md:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto text-center pb-12"
        >
          <div className="mb-8 text-center">
            <NeonText glow="#60A5FA" colorClass="text-blue-50" size="text-5xl">
              {bioTagline}
            </NeonText>
          </div>
          <p className="text-blue-100/85">
            Nikmati pengalaman makan dan nongkrong yang tak terlupakan di Cave
            Haircoolest.
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
