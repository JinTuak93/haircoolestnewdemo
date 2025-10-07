/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";

import {
  setTitle,
  setSubtitle,
  uploadImage,
  setHeaderImage,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  getPlaygroundItems,
  addPlaygroundItem,
  updatePlaygroundItem,
  deletePlaygroundItem,
  setBioText,
  setBioImage,
  setDisclaimerText,
  setTaglineText,
  getMenuCategories,
  getMenuItems,
  addMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,

  // ===== Events (pastikan tersedia di services/cave.ts) =====
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "@/services/cave";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

/* =================== helpers =================== */
function Section({
  title,
  desc,
  right,
  children,
}: {
  title: string;
  desc?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-neutral-950 text-white border border-neutral-800">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-white">{title}</CardTitle>
          {desc ? (
            <CardDescription className="text-neutral-400">
              {desc}
            </CardDescription>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function FileTrigger({
  id,
  label,
  disabled,
  accept,
  onFileSelected,
}: {
  id: string;
  label: string;
  disabled?: boolean;
  accept?: string;
  onFileSelected: (file: File) => void;
}) {
  return (
    <div className="flex items-center">
      <Input
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const f = e.currentTarget.files?.[0];
          if (f) onFileSelected(f);
          e.currentTarget.value = "";
        }}
      />
      <Label
        htmlFor={id}
        className={`inline-flex items-center justify-center rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800 cursor-pointer ${
          disabled ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {label}
      </Label>
    </div>
  );
}

function MediaFrame({
  src,
  emptyText,
  onChangeClickId,
  onFileSelected,
  disabled,
  aspect = "h-48",
  contain = false,
}: {
  src?: string;
  emptyText?: string;
  onChangeClickId: string;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  aspect?: string;
  contain?: boolean;
}) {
  return (
    <div
      className={`relative w-full ${aspect} rounded-md overflow-hidden border border-neutral-800 bg-black`}
    >
      {src ? (
        <Image
          src={src}
          alt="Preview"
          fill
          className={contain ? "object-contain" : "object-cover"}
        />
      ) : (
        <div className="h-full grid place-items-center text-sm text-neutral-400">
          {emptyText || "No media"}
        </div>
      )}
      <div className="absolute top-2 right-2">
        <FileTrigger
          id={onChangeClickId}
          label="Change"
          disabled={disabled}
          onFileSelected={onFileSelected}
          accept="image/*"
        />
      </div>
    </div>
  );
}

/* =================== types =================== */
type GalleryImageT = { id: string; imageUrl: string };
type PlaygroundItemT = { id: string; name: string; imageUrl: string };
type MenuCategoryT = { id: string; name: string; order?: number };
type MenuItemT = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
};
type EventT = {
  id: string;
  title: string;
  date?: string; // stored as "YYYY-MM-DDTHH:mm" in state (local), convert to ISO on save
  location?: string;
  imageUrl?: string;
  description?: string;
};

/* ====== date helpers (local <-> ISO) ====== */
function isoToLocalInput(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`;
  } catch {
    return "";
  }
}
function localToISO(local?: string) {
  if (!local) return undefined;
  try {
    // Safari-friendly: add ":00" seconds if missing
    const str = /\d{2}:\d{2}$/.test(local) ? `${local}:00` : local;
    return new Date(str).toISOString();
  } catch {
    return undefined;
  }
}

/* =================== main =================== */
export function DashboardCaveClient({
  initialTitle,
  initialSubtitle,
  initialHeaderImage,
  initialBioText,
  initialBioImage,
  initialDisclaimerText,
  initialTaglineText,
  initialGallery,
  initialPlayground,
  initialCategories,
  initialMenuItems,
}: {
  initialTitle: string;
  initialSubtitle: string;
  initialHeaderImage: string;
  initialBioText: string;
  initialBioImage: string;
  initialDisclaimerText: string;
  initialTaglineText: string;
  initialGallery: GalleryImageT[];
  initialPlayground: PlaygroundItemT[];
  initialCategories: MenuCategoryT[];
  initialMenuItems: MenuItemT[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Header
  const [title, setTitleState] = useState(initialTitle);
  const [subtitle, setSubtitleState] = useState(initialSubtitle);
  const [headerImage, setHeaderImageState] = useState(initialHeaderImage);

  // Bio & texts
  const [bioText, setBioTextState] = useState(initialBioText);
  const [bioImage, setBioImageState] = useState(initialBioImage);
  const [disclaimerText, setDisclaimerTextState] = useState(
    initialDisclaimerText
  );
  const [taglineText, setTaglineTextState] = useState(initialTaglineText);

  // Lists
  const [gallery, setGallery] = useState<GalleryImageT[]>(initialGallery || []);
  const [playground, setPlayground] = useState<PlaygroundItemT[]>(
    initialPlayground || []
  );

  const [categories, setCategories] = useState<MenuCategoryT[]>(
    (initialCategories || []).sort((a, b) => (a.order || 0) - (b.order || 0))
  );
  const [menuItems, setMenuItems] = useState<MenuItemT[]>(
    initialMenuItems || []
  );

  // New Playground form
  const [npName, setNpName] = useState("");
  const [npFile, setNpFile] = useState<File | null>(null);
  const [npPreview, setNpPreview] = useState("");

  // New Category form
  const [ncName, setNcName] = useState("");
  const [ncOrder, setNcOrder] = useState<number | "">("");

  // New Menu Item form
  const [niName, setNiName] = useState("");
  const [niDesc, setNiDesc] = useState("");
  const [niCat, setNiCat] = useState<string>("");
  const [niFile, setNiFile] = useState<File | null>(null);
  const [niPreview, setNiPreview] = useState("");

  // ===== Events state =====
  const [events, setEvents] = useState<EventT[]>([]);
  // New Event form
  const [neTitle, setNeTitle] = useState("");
  const [neDate, setNeDate] = useState(""); // "YYYY-MM-DDTHH:mm"
  const [neLocation, setNeLocation] = useState("");
  const [neDesc, setNeDesc] = useState("");
  const [neFile, setNeFile] = useState<File | null>(null);
  const [nePreview, setNePreview] = useState("");

  const loadingIcon = useMemo(
    () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
    []
  );

  useEffect(() => {
    // initial load events
    (async () => {
      try {
        const evs = await getEvents();
        const mapped = (evs || []).map((e: any) => ({
          id: e.id,
          title: e.title || "",
          date: isoToLocalInput(e.date),
          location: e.location || "",
          imageUrl: e.imageUrl || e.image || "",
          description: e.description || "",
        }));
        setEvents(mapped);
      } catch {
        // silent
      }
    })();

    return () => {
      if (npPreview) URL.revokeObjectURL(npPreview);
      if (niPreview) URL.revokeObjectURL(niPreview);
      if (nePreview) URL.revokeObjectURL(nePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ========== Header handlers ========== */
  const saveTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ok = await setTitle(title);
      ok
        ? toast.success("Title berhasil diperbarui!")
        : toast.error("Gagal menyimpan title");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveSubtitle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ok = await setSubtitle(subtitle);
      ok
        ? toast.success("Subtitle berhasil diperbarui!")
        : toast.error("Gagal menyimpan subtitle");
    } finally {
      setIsSubmitting(false);
    }
  };
  const changeHeaderImg = async (file: File) => {
    setIsSubmitting(true);
    try {
      const url = await uploadImage(file, "cave/header");
      const ok = await setHeaderImage(url);
      if (ok) {
        setHeaderImageState(url);
        toast.success("Gambar header berhasil diperbarui!");
      } else toast.error("Gagal menyimpan URL header");
    } catch (e: any) {
      toast.error(e?.message || "Upload gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ========== Bio & texts handlers ========== */
  const saveBioText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ok = await setBioText(bioText);
      ok
        ? toast.success("Bio berhasil diperbarui!")
        : toast.error("Gagal menyimpan Bio");
    } finally {
      setIsSubmitting(false);
    }
  };
  const changeBioImg = async (file: File) => {
    setIsSubmitting(true);
    try {
      const url = await uploadImage(file, "cave/bio");
      const ok = await setBioImage(url);
      if (ok) {
        setBioImageState(url);
        toast.success("Gambar Bio berhasil diperbarui!");
      } else toast.error("Gagal menyimpan URL Bio");
    } catch (e: any) {
      toast.error(e?.message || "Upload gagal");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveDisclaimer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ok = await setDisclaimerText(disclaimerText);
      ok
        ? toast.success("Disclaimer berhasil diperbarui!")
        : toast.error("Gagal menyimpan Disclaimer");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveTagline = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ok = await setTaglineText(taglineText);
      ok
        ? toast.success("Tagline berhasil diperbarui!")
        : toast.error("Gagal menyimpan Tagline");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ========== Playground handlers ========== */
  const onPlayImage = (file: File) => {
    setNpFile(file);
    const u = URL.createObjectURL(file);
    if (npPreview) URL.revokeObjectURL(npPreview);
    setNpPreview(u);
  };
  const addPlayground = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!npName || !npFile) return toast.error("Nama & Gambar wajib diisi");
    setIsSubmitting(true);
    try {
      const url = await uploadImage(npFile, "cave/playground");
      const id = await addPlaygroundItem({ name: npName, imageUrl: url });
      setPlayground((p) => [...p, { id, name: npName, imageUrl: url }]);
      setNpName("");
      setNpFile(null);
      if (npPreview) URL.revokeObjectURL(npPreview);
      setNpPreview("");
      toast.success("Playground item berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan item");
    } finally {
      setIsSubmitting(false);
    }
  };
  const savePlayground = async (id: string) => {
    const it = playground.find((x) => x.id === id);
    if (!it) return;
    setIsSubmitting(true);
    try {
      await updatePlaygroundItem(id, { name: it.name });
      toast.success("Playground item berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui item");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delPlayground = async (id: string) => {
    if (!confirm("Hapus item ini?")) return;
    setIsSubmitting(true);
    try {
      await deletePlaygroundItem(id);
      setPlayground((p) => p.filter((x) => x.id !== id));
      toast.success("Playground item berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus item");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ========== Gallery handlers ========== */
  const addGallery = async (file: File) => {
    setIsSubmitting(true);
    try {
      const url = await uploadImage(file, "cave/gallery");
      const id = await addGalleryImage(url);
      setGallery((p) => [...p, { id, imageUrl: url }]);
      toast.success("Gambar gallery berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan gambar gallery");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delGallery = async (id: string) => {
    if (!confirm("Hapus gambar ini?")) return;
    setIsSubmitting(true);
    try {
      await deleteGalleryImage(id);
      setGallery((p) => p.filter((x) => x.id !== id));
      toast.success("Gambar gallery berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus gambar gallery");
    } finally {
      setIsSubmitting(false);
    }
  };
  const reloadGalleryPlayground = async () => {
    try {
      const [g, p] = await Promise.all([
        getGalleryImages(),
        getPlaygroundItems(),
      ]);
      setGallery(g);
      setPlayground(p);
      toast.success("Data diperbarui");
    } catch {
      toast.error("Gagal memuat ulang");
    }
  };

  /* ========== Menu (categories + items) handlers ========== */
  const reloadMenu = async () => {
    try {
      const [c, i] = await Promise.all([getMenuCategories(), getMenuItems()]);
      setCategories(c.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setMenuItems(i);
      toast.success("Menu diperbarui");
    } catch {
      toast.error("Gagal memuat menu");
    }
  };

  // Categories
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ncName) return toast.error("Nama kategori wajib diisi");
    setIsSubmitting(true);
    try {
      const id = await addMenuCategory({
        name: ncName,
        order: typeof ncOrder === "number" ? ncOrder : undefined,
      });
      setCategories((p) =>
        [
          ...p,
          {
            id,
            name: ncName,
            order: typeof ncOrder === "number" ? ncOrder : undefined,
          },
        ].sort((a, b) => (a.order || 0) - (b.order || 0))
      );
      setNcName("");
      setNcOrder("");
      toast.success("Kategori ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan kategori");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveCategory = async (id: string) => {
    const c = categories.find((x) => x.id === id);
    if (!c) return;
    setIsSubmitting(true);
    try {
      await updateMenuCategory(id, { name: c.name, order: c.order });
      setCategories((p) =>
        [...p].sort((a, b) => (a.order || 0) - (b.order || 0))
      );
      toast.success("Kategori diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui kategori");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delCategory = async (id: string) => {
    if (
      !confirm("Hapus kategori ini? Item di kategori ini tidak ikut terhapus.")
    )
      return;
    setIsSubmitting(true);
    try {
      await deleteMenuCategory(id);
      setCategories((p) => p.filter((x) => x.id !== id));
      toast.success("Kategori dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Items
  const onItemImage = (file: File) => {
    setNiFile(file);
    const u = URL.createObjectURL(file);
    if (niPreview) URL.revokeObjectURL(niPreview);
    setNiPreview(u);
  };
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niName || !niDesc || !niFile || !niCat) {
      return toast.error("Nama, Deskripsi, Gambar, & Kategori wajib diisi");
    }
    setIsSubmitting(true);
    try {
      const url = await uploadImage(niFile, "cave/menu");
      const id = await addMenuItem({
        name: niName,
        description: niDesc,
        categoryId: niCat,
        imageUrl: url,
      });
      setMenuItems((p) => [
        ...p,
        {
          id,
          name: niName,
          description: niDesc,
          categoryId: niCat,
          imageUrl: url,
        },
      ]);
      setNiName("");
      setNiDesc("");
      setNiCat("");
      setNiFile(null);
      if (niPreview) URL.revokeObjectURL(niPreview);
      setNiPreview("");
      toast.success("Item berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan item");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveItem = async (id: string) => {
    const it = menuItems.find((x) => x.id === id);
    if (!it) return;
    setIsSubmitting(true);
    try {
      await updateMenuItem(id, {
        name: it.name,
        description: it.description,
        categoryId: it.categoryId,
      });
      toast.success("Item berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui item");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delItem = async (id: string) => {
    if (!confirm("Hapus item ini?")) return;
    setIsSubmitting(true);
    try {
      await deleteMenuItem(id);
      setMenuItems((p) => p.filter((x) => x.id !== id));
      toast.success("Item berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus item");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ========== Events handlers ========== */
  const onNewEventImage = (file: File) => {
    setNeFile(file);
    const u = URL.createObjectURL(file);
    if (nePreview) URL.revokeObjectURL(nePreview);
    setNePreview(u);
  };
  const addEventHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!neTitle) return toast.error("Judul event wajib diisi");
    setIsSubmitting(true);
    try {
      let imgUrl: string | undefined;
      if (neFile) {
        imgUrl = await uploadImage(neFile, "cave/events");
      }
      const payload = {
        title: neTitle,
        date: localToISO(neDate),
        location: neLocation || undefined,
        imageUrl: imgUrl,
        description: neDesc || undefined,
      };
      const id = await addEvent(payload as any);
      setEvents((p) => [
        ...p,
        {
          id,
          title: neTitle,
          date: neDate || "",
          location: neLocation,
          imageUrl: imgUrl,
          description: neDesc,
        },
      ]);
      setNeTitle("");
      setNeDate("");
      setNeLocation("");
      setNeDesc("");
      setNeFile(null);
      if (nePreview) URL.revokeObjectURL(nePreview);
      setNePreview("");
      toast.success("Event berhasil ditambahkan!");
    } catch (err: any) {
      toast.error(err?.message || "Gagal menambahkan event");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveEventHandler = async (id: string) => {
    const ev = events.find((x) => x.id === id);
    if (!ev) return;
    setIsSubmitting(true);
    try {
      await updateEvent(id, {
        title: ev.title,
        date: localToISO(ev.date),
        location: ev.location || undefined,
        description: ev.description || undefined,
      });
      toast.success("Event berhasil diperbarui!");
    } catch (err: any) {
      toast.error(err?.message || "Gagal memperbarui event");
    } finally {
      setIsSubmitting(false);
    }
  };
  const changeEventImage = async (id: string, file: File) => {
    setIsSubmitting(true);
    try {
      const url = await uploadImage(file, "cave/events");
      await updateEvent(id, { imageUrl: url });
      setEvents((p) =>
        p.map((e) => (e.id === id ? { ...e, imageUrl: url } : e))
      );
      toast.success("Gambar event berhasil diperbarui!");
    } catch (err: any) {
      toast.error(err?.message || "Upload gambar gagal");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delEventHandler = async (id: string) => {
    if (!confirm("Hapus event ini?")) return;
    setIsSubmitting(true);
    try {
      await deleteEvent(id);
      setEvents((p) => p.filter((e) => e.id !== id));
      toast.success("Event dihapus");
    } catch (err: any) {
      toast.error(err?.message || "Gagal menghapus event");
    } finally {
      setIsSubmitting(false);
    }
  };
  const reloadEvents = async () => {
    try {
      const evs = await getEvents();
      const mapped = (evs || []).map((e: any) => ({
        id: e.id,
        title: e.title || "",
        date: isoToLocalInput(e.date),
        location: e.location || "",
        imageUrl: e.imageUrl || e.image || "",
        description: e.description || "",
      }));
      setEvents(mapped);
      toast.success("Event diperbarui");
    } catch {
      toast.error("Gagal memuat event");
    }
  };

  /* =================== UI =================== */
  return (
    <div className="min-h-[100dvh] bg-black text-white p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl md:text-4xl font-bold">Dashboard Cave</h1>
      <p className="text-neutral-400 mt-1 mb-6">Kelola konten .Cave</p>

      <div className="sticky top-0 z-20 -mx-6 md:-mx-8 px-6 md:px-8 py-3 bg-black/70 backdrop-blur">
        <Tabs defaultValue="header" className="w-full">
          <TabsList className="bg-neutral-900/60 border border-neutral-800">
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="header"
            >
              Header
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="bio"
            >
              Bio & Texts
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="playground"
            >
              Playground
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="menu"
            >
              Menu
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="gallery"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="events"
            >
              Events
            </TabsTrigger>
          </TabsList>

          {/* ===== HEADER ===== */}
          <TabsContent value="header" className="pt-6">
            <div className="flex flex-col gap-6">
              <Section title="Texts" desc="Judul & subjudul header">
                <div className="grid gap-6">
                  <form onSubmit={saveTitle} className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Textarea
                      id="title"
                      value={title}
                      onChange={(e) => setTitleState(e.target.value)}
                      className="min-h-[100px] bg-neutral-950 border-neutral-800 text-white"
                    />
                    <div className="flex justify-end">
                      <Button variant="destructive" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>{loadingIcon}Menyimpan…</>
                        ) : (
                          "Simpan Title"
                        )}
                      </Button>
                    </div>
                  </form>

                  <form onSubmit={saveSubtitle} className="grid gap-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                      id="subtitle"
                      value={subtitle}
                      onChange={(e) => setSubtitleState(e.target.value)}
                      className="min-h-[130px] bg-neutral-950 border-neutral-800 text-white"
                    />
                    <div className="flex justify-end">
                      <Button variant="destructive" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>{loadingIcon}Menyimpan…</>
                        ) : (
                          "Simpan Subtitle"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </Section>

              <Section
                title="Header Background"
                desc="Gambar besar di bagian atas halaman"
              >
                <MediaFrame
                  src={headerImage}
                  emptyText="Belum ada gambar"
                  onChangeClickId="hdr-img"
                  onFileSelected={changeHeaderImg}
                  disabled={isSubmitting}
                  aspect="aspect-[16/9]"
                />
              </Section>
            </div>
          </TabsContent>

          {/* ===== BIO & TEXTS ===== */}
          <TabsContent value="bio" className="pt-6">
            <div className="flex flex-col gap-6">
              <Section title="Bio Text">
                <form onSubmit={saveBioText} className="grid gap-2">
                  <Textarea
                    value={bioText}
                    onChange={(e) => setBioTextState(e.target.value)}
                    className="min-h-[160px] bg-neutral-950 border-neutral-800 text-white"
                  />
                  <div className="flex justify-end">
                    <Button variant="destructive" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>{loadingIcon}Menyimpan…</>
                      ) : (
                        "Simpan Bio"
                      )}
                    </Button>
                  </div>
                </form>
              </Section>

              <Section title="Bio Image">
                <MediaFrame
                  src={bioImage}
                  emptyText="Belum ada gambar"
                  onChangeClickId="bio-img"
                  onFileSelected={(f) => changeBioImg(f)}
                  disabled={isSubmitting}
                  aspect="h-72"
                  contain
                />
              </Section>

              <Section title="Disclaimer">
                <form onSubmit={saveDisclaimer} className="grid gap-2">
                  <Textarea
                    value={disclaimerText}
                    onChange={(e) => setDisclaimerTextState(e.target.value)}
                    className="min-h-[120px] bg-neutral-950 border-neutral-800 text-white"
                  />
                  <div className="flex justify-end">
                    <Button variant="destructive" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>{loadingIcon}Menyimpan…</>
                      ) : (
                        "Simpan Disclaimer"
                      )}
                    </Button>
                  </div>
                </form>
              </Section>

              <Section title="Tagline">
                <form onSubmit={saveTagline} className="grid gap-2">
                  <Textarea
                    value={taglineText}
                    onChange={(e) => setTaglineTextState(e.target.value)}
                    className="min-h-[90px] bg-neutral-950 border-neutral-800 text-white"
                  />
                  <div className="flex justify-end">
                    <Button variant="destructive" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>{loadingIcon}Menyimpan…</>
                      ) : (
                        "Simpan Tagline"
                      )}
                    </Button>
                  </div>
                </form>
              </Section>
            </div>
          </TabsContent>

          {/* ===== PLAYGROUND ===== */}
          <TabsContent value="playground" className="pt-6">
            <div className="grid gap-6">
              <Section
                title="Tambah Playground Item"
                desc="Card di section Playground"
              >
                <form onSubmit={addPlayground} className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Nama</Label>
                      <Input
                        value={npName}
                        onChange={(e) => setNpName(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Gambar</Label>
                      <FileTrigger
                        id="plg-file"
                        label="Pilih Gambar"
                        accept="image/*"
                        onFileSelected={onPlayImage}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {npPreview && (
                    <div className="relative w-full h-40 rounded-md overflow-hidden border border-neutral-800 bg-black">
                      <Image
                        src={npPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isSubmitting || !npName || !npFile}
                    >
                      {isSubmitting ? (
                        <>{loadingIcon}Menambahkan…</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah Item
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Section>

              <Section
                title="Daftar Playground"
                right={
                  <Button
                    variant="outline"
                    className="text-black"
                    onClick={reloadGalleryPlayground}
                  >
                    Reload
                  </Button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playground.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                    >
                      <div className="relative w-full h-44 rounded-md overflow-hidden border border-neutral-800 mb-3">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Input
                        value={p.name}
                        onChange={(e) =>
                          setPlayground((prev) =>
                            prev.map((x) =>
                              x.id === p.id ? { ...x, name: e.target.value } : x
                            )
                          )
                        }
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                      <div className="flex gap-2 justify-end mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-black"
                          onClick={() => savePlayground(p.id)}
                          disabled={isSubmitting}
                        >
                          Simpan
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => delPlayground(p.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!playground.length && (
                    <div className="col-span-full text-center p-8 border border-dashed border-neutral-800 rounded-md">
                      <p className="text-neutral-500">
                        Belum ada item playground
                      </p>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </TabsContent>

          {/* ===== MENU ===== */}
          <TabsContent value="menu" className="pt-6">
            <div className="grid gap-6">
              {/* Categories */}
              <Section
                title="Kategori Menu"
                desc="Urutan kategori menentukan urutan tabs"
              >
                <form
                  onSubmit={addCategory}
                  className="grid gap-3 md:grid-cols-3 mb-4"
                >
                  <div className="grid gap-2">
                    <Label>Nama</Label>
                    <Input
                      value={ncName}
                      onChange={(e) => setNcName(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Urutan</Label>
                    <Input
                      value={ncOrder}
                      onChange={(e) =>
                        setNcOrder(e.target.value ? Number(e.target.value) : "")
                      }
                      type="number"
                      className="bg-neutral-950 border-neutral-800 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isSubmitting || !ncName || !ncOrder}
                    >
                      {isSubmitting ? (
                        <>{loadingIcon}Menambahkan…</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                    >
                      <div className="grid gap-2">
                        <Label>Nama</Label>
                        <Input
                          value={c.name}
                          onChange={(e) =>
                            setCategories((prev) =>
                              prev.map((x) =>
                                x.id === c.id
                                  ? { ...x, name: e.target.value }
                                  : x
                              )
                            )
                          }
                          className="bg-neutral-950 border-neutral-800 text-white"
                        />
                        <Label>Urutan</Label>
                        <Input
                          value={typeof c.order === "number" ? c.order : 0}
                          onChange={(e) =>
                            setCategories((prev) =>
                              prev.map((x) =>
                                x.id === c.id
                                  ? { ...x, order: Number(e.target.value) }
                                  : x
                              )
                            )
                          }
                          type="number"
                          className="bg-neutral-950 border-neutral-800 text-white"
                        />
                        <div className="flex gap-2 justify-end mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-black"
                            onClick={() => saveCategory(c.id)}
                            disabled={isSubmitting}
                          >
                            Simpan
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => delCategory(c.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!categories.length && (
                    <div className="col-span-full text-center p-8 border border-dashed border-neutral-800 rounded-md">
                      <p className="text-neutral-500">Belum ada kategori</p>
                    </div>
                  )}
                </div>
              </Section>

              {/* Items */}
              <Section
                title="Item Menu"
                right={
                  <Button
                    variant="outline"
                    className="text-black"
                    onClick={reloadMenu}
                  >
                    Reload Menu
                  </Button>
                }
              >
                <form
                  onSubmit={addItem}
                  className="grid gap-3 md:grid-cols-4 mb-4"
                >
                  <div className="grid gap-2 md:col-span-2">
                    <Label>Nama</Label>
                    <Input
                      value={niName}
                      onChange={(e) => setNiName(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-white"
                    />
                    <Label>Deskripsi</Label>
                    <Textarea
                      value={niDesc}
                      onChange={(e) => setNiDesc(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-white min-h-[80px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Kategori</Label>
                    <select
                      value={niCat}
                      onChange={(e) => setNiCat(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Pilih kategori</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <Label>Gambar</Label>
                    <FileTrigger
                      id="mi-file"
                      label="Pilih Gambar"
                      accept="image/*"
                      onFileSelected={(f) => {
                        setNiFile(f);
                        const u = URL.createObjectURL(f);
                        if (niPreview) URL.revokeObjectURL(niPreview);
                        setNiPreview(u);
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={
                        isSubmitting || !niName || !niDesc || !niFile || !niCat
                      }
                    >
                      {isSubmitting ? (
                        <>{loadingIcon}Menambahkan…</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah Item
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {niPreview && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border border-neutral-800 bg-black mb-4">
                    <Image
                      src={niPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                    >
                      <div className="relative w-full h-44 rounded-md overflow-hidden border border-neutral-800 mb-3">
                        <Image
                          src={m.imageUrl}
                          alt={m.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Label>Nama</Label>
                      <Input
                        value={m.name}
                        onChange={(e) =>
                          setMenuItems((prev) =>
                            prev.map((x) =>
                              x.id === m.id ? { ...x, name: e.target.value } : x
                            )
                          )
                        }
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                      <Label className="mt-2">Deskripsi</Label>
                      <Textarea
                        value={m.description}
                        onChange={(e) =>
                          setMenuItems((prev) =>
                            prev.map((x) =>
                              x.id === m.id
                                ? { ...x, description: e.target.value }
                                : x
                            )
                          )
                        }
                        className="bg-neutral-950 border-neutral-800 text-white min-h-[80px]"
                      />
                      <Label className="mt-2">Kategori</Label>
                      <select
                        value={m.categoryId}
                        onChange={(e) =>
                          setMenuItems((prev) =>
                            prev.map((x) =>
                              x.id === m.id
                                ? { ...x, categoryId: e.target.value }
                                : x
                            )
                          )
                        }
                        className="bg-neutral-950 border border-neutral-800 text-white rounded-md px-3 py-2"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2 justify-end mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-black"
                          onClick={() => saveItem(m.id)}
                          disabled={isSubmitting}
                        >
                          Simpan
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => delItem(m.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!menuItems.length && (
                    <div className="col-span-full text-center p-8 border border-dashed border-neutral-800 rounded-md">
                      <p className="text-neutral-500">Belum ada item menu</p>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </TabsContent>

          {/* ===== GALLERY ===== */}
          <TabsContent value="gallery" className="pt-6">
            <div className="grid gap-6">
              <Section
                title="Tambah Gambar Gallery"
                right={
                  <FileTrigger
                    id="gal-file"
                    label={isSubmitting ? "Uploading…" : "Upload"}
                    onFileSelected={addGallery}
                    accept="image/*"
                    disabled={isSubmitting}
                  />
                }
              >
                <p className="text-sm text-neutral-400">
                  Upload ambience untuk halaman Cave.
                </p>
              </Section>

              <Section
                title="Daftar Gallery"
                right={
                  <Button
                    variant="outline"
                    className="text-black"
                    onClick={reloadGalleryPlayground}
                  >
                    Reload
                  </Button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gallery.map((g) => (
                    <div
                      key={g.id}
                      className="relative group rounded-md overflow-hidden border border-neutral-800"
                    >
                      <div className="relative w-full h-48">
                        <Image
                          src={g.imageUrl}
                          alt="Gallery"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => delGallery(g.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!gallery.length && (
                    <div className="col-span-full text-center p-8 border border-dashed border-neutral-800 rounded-md">
                      <p className="text-neutral-500">
                        Belum ada gambar gallery
                      </p>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </TabsContent>

          {/* ===== EVENTS ===== */}
          <TabsContent value="events" className="pt-6">
            <div className="grid gap-6">
              <Section
                title="Tambah Event"
                desc="Buat event baru untuk ditampilkan di halaman Cave"
              >
                <form onSubmit={addEventHandler} className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Judul</Label>
                      <Input
                        value={neTitle}
                        onChange={(e) => setNeTitle(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white"
                        placeholder="Nama Event"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Tanggal & Waktu</Label>
                      <div className="flex items-center gap-2">
                        {/* ==== Date (Popover Calendar) ==== */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="justify-between font-normal bg-neutral-950 border-neutral-800 text-white w-[210px]"
                            >
                              {(() => {
                                const d = neDate ? new Date(neDate) : undefined;
                                return d
                                  ? d.toLocaleDateString("id-ID", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : "Pilih tanggal";
                              })()}
                              <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              selected={neDate ? new Date(neDate) : undefined}
                              onSelect={(date) => {
                                if (!date) return;
                                const pad = (n: number) =>
                                  String(n).padStart(2, "0");
                                const y = date.getFullYear();
                                const m = pad(date.getMonth() + 1);
                                const d = pad(date.getDate());
                                const timePart =
                                  neDate?.split("T")[1]?.slice(0, 5) || "12:00"; // HH:mm
                                setNeDate(`${y}-${m}-${d}T${timePart}`);
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        {/* ==== Time (HH:mm) ==== */}
                        {/* <Input
                          type="time"
                          value={neDate?.split("T")[1]?.slice(0, 5) || ""}
                          onChange={(e) => {
                            const time = e.target.value; // "HH:mm"
                            const datePart =
                              neDate?.split("T")[0] ||
                              new Date().toISOString().slice(0, 10);
                            setNeDate(`${datePart}T${time}`);
                          }}
                          className="bg-neutral-950 border-neutral-800 text-white w-[130px]"
                        /> */}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Lokasi</Label>
                      <Input
                        value={neLocation}
                        onChange={(e) => setNeLocation(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white"
                        placeholder="Alamat/Lokasi"
                      />
                    </div>
                    <div className="md:col-span-2 grid gap-2">
                      <Label>Deskripsi</Label>
                      <Textarea
                        value={neDesc}
                        onChange={(e) => setNeDesc(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white min-h-[90px]"
                        placeholder="Detail singkat event"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Gambar</Label>
                      <FileTrigger
                        id="event-file"
                        label="Pilih Gambar"
                        accept="image/*"
                        onFileSelected={onNewEventImage}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {nePreview && (
                    <div className="relative w-full h-44 rounded-md overflow-hidden border border-neutral-800 bg-black">
                      <Image
                        src={nePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isSubmitting || !neTitle}
                    >
                      {isSubmitting ? (
                        <>{loadingIcon}Menambahkan…</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah Event
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Section>

              <Section
                title="Daftar Event"
                right={
                  <Button
                    variant="outline"
                    className="text-black"
                    onClick={reloadEvents}
                  >
                    Reload
                  </Button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                    >
                      <div className="relative w-full h-44 rounded-md overflow-hidden border border-neutral-800 mb-3">
                        {ev.imageUrl ? (
                          <Image
                            src={ev.imageUrl}
                            alt={ev.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center text-neutral-500">
                            Tidak ada gambar
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <FileTrigger
                            id={`ev-file-${ev.id}`}
                            label="Change"
                            accept="image/*"
                            disabled={isSubmitting}
                            onFileSelected={(f) => changeEventImage(ev.id, f)}
                          />
                        </div>
                      </div>

                      <Label>Judul</Label>
                      <Input
                        value={ev.title}
                        onChange={(e) =>
                          setEvents((prev) =>
                            prev.map((x) =>
                              x.id === ev.id
                                ? { ...x, title: e.target.value }
                                : x
                            )
                          )
                        }
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="grid gap-1.5 text-white">
                          <Label>Tanggal & Waktu</Label>

                          <div className="flex items-center gap-2">
                            {/* ==== Date (Popover Calendar) ==== */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="justify-between font-normal bg-neutral-950 border-neutral-800 text-white w-[210px]"
                                >
                                  {(() => {
                                    const d = ev.date
                                      ? new Date(ev.date)
                                      : undefined;
                                    return d
                                      ? d.toLocaleDateString("id-ID", {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                        })
                                      : "Pilih tanggal";
                                  })()}
                                  <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown"
                                  selected={
                                    ev.date ? new Date(ev.date) : undefined
                                  }
                                  onSelect={(date) => {
                                    if (!date) return;
                                    const pad = (n: number) =>
                                      String(n).padStart(2, "0");
                                    const y = date.getFullYear();
                                    const m = pad(date.getMonth() + 1);
                                    const d = pad(date.getDate());
                                    const timePart =
                                      ev.date
                                        ?.split("T")[1]
                                        ?.slice(0, 5) /* HH:mm */ || "12:00";
                                    const combined = `${y}-${m}-${d}T${timePart}`;

                                    setEvents((prev) =>
                                      prev.map((x) =>
                                        x.id === ev.id
                                          ? { ...x, date: combined }
                                          : x
                                      )
                                    );
                                  }}
                                />
                              </PopoverContent>
                            </Popover>

                            {/* ==== Time (HH:mm) ==== */}
                            {/* <Input
                              type="time"
                              value={ev.date?.split("T")[1]?.slice(0, 5) || ""}
                              onChange={(e) => {
                                const time = e.target.value; // "HH:mm"
                                const datePart =
                                  ev.date?.split("T")[0] ||
                                  new Date().toISOString().slice(0, 10); // fallback: today (YYYY-MM-DD)
                                const combined = `${datePart}T${time}`;
                                setEvents((prev) =>
                                  prev.map((x) =>
                                    x.id === ev.id
                                      ? { ...x, date: combined }
                                      : x
                                  )
                                );
                              }}
                              className="bg-neutral-950 border-neutral-800 text-white w-[130px]"
                            /> */}
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <Label>Lokasi</Label>
                          <Input
                            value={ev.location || ""}
                            onChange={(e) =>
                              setEvents((prev) =>
                                prev.map((x) =>
                                  x.id === ev.id
                                    ? { ...x, location: e.target.value }
                                    : x
                                )
                              )
                            }
                            className="bg-neutral-950 border-neutral-800 text-white"
                          />
                        </div>
                      </div>

                      <Label className="mt-2">Deskripsi</Label>
                      <Textarea
                        value={ev.description || ""}
                        onChange={(e) =>
                          setEvents((prev) =>
                            prev.map((x) =>
                              x.id === ev.id
                                ? { ...x, description: e.target.value }
                                : x
                            )
                          )
                        }
                        className="bg-neutral-950 border-neutral-800 text-white min-h-[80px]"
                      />

                      <div className="flex gap-2 justify-end mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-black"
                          onClick={() => saveEventHandler(ev.id)}
                          disabled={isSubmitting}
                        >
                          Simpan
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => delEventHandler(ev.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {!events.length && (
                    <div className="col-span-full text-center p-8 border border-dashed border-neutral-800 rounded-md">
                      <p className="text-neutral-500">Belum ada event</p>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
