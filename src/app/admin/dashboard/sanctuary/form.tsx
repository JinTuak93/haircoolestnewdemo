/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
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
import { ArrowUp, Loader2, Pause, Play, Plus, Trash2 } from "lucide-react";

import {
  setTitle as setTitleFn,
  setSubtitle as setSubtitleFn,
  setHistoryText,
  setDisclaimerText,
  uploadImage,
  uploadVideo,
  setHeaderImage,
  setSanctuaryImage,
  addBarber,
  updateBarber,
  deleteBarber,
  addGalleryImage,
  deleteGalleryImage,
  setVideoTitle,
  addVideo,
  deleteVideo,
  setMainVideo,
  getAwards,
  addAward,
  updateAward,
  deleteAward,
} from "@/services/sanctuary";

/* ===================== Types ===================== */
type Barber = { id: string; name: string; position: string; imageUrl: string };
type GalleryImage = { id: string; imageUrl: string };
type Video = { id: string; url: string };
type Award = { id: string; name: string; imageUrl: string };

/* ================ Small UI Helpers ================= */
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

/* ===================== Main ===================== */
export function DashboardSanctuaryClient({
  initialTitle,
  initialSubtitle,
  initialHistoryText,
  initialDisclaimerText,
  initialHeaderImage,
  initialSanctuaryImage,
  initialBarbers,
  initialGalleryImages,
  initialVideoUrl,
  initialVideoTitle,
  initialVideos,
  initialMainVideo,
}: {
  initialTitle: string;
  initialSubtitle: string;
  initialHistoryText: string;
  initialDisclaimerText: string;
  initialHeaderImage: string;
  initialSanctuaryImage: string;
  initialBarbers: Barber[];
  initialGalleryImages: GalleryImage[];
  initialVideoUrl: string;
  initialVideoTitle: string;
  initialVideos: Video[];
  initialMainVideo: Video | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitleState] = useState(initialTitle);
  const [subtitle, setSubtitleState] = useState(initialSubtitle);
  const [historyText, setHistoryTextState] = useState(initialHistoryText);
  const [disclaimerText, setDisclaimerTextState] = useState(
    initialDisclaimerText
  );

  const [headerImage, setHeaderImageState] = useState(initialHeaderImage);
  const [sanctuaryImage, setSanctuaryImageState] = useState(
    initialSanctuaryImage
  );

  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGalleryImages);

  const [videoTitle, setVideoTitleState] = useState(
    initialVideoTitle || "Dari Momen Biasa, Jadi Luar Biasa!"
  );
  const [videos, setVideos] = useState<Video[]>(initialVideos || []);
  const [mainVideo, setMainVideoState] = useState<Video | null>(
    initialMainVideo
  );
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);

  const [awards, setAwards] = useState<Award[]>([]);
  const [awardsLoading, setAwardsLoading] = useState(true);

  // add barber form
  const [nbName, setNbName] = useState("");
  const [nbPosition, setNbPosition] = useState("");
  const [nbFile, setNbFile] = useState<File | null>(null);
  const [nbPreview, setNbPreview] = useState<string>("");
  const [editingBarber, setEditingBarber] = useState<string | null>(null);

  // add award form
  const [naName, setNaName] = useState("");
  const [naFile, setNaFile] = useState<File | null>(null);
  const [naPreview, setNaPreview] = useState<string>("");
  const [editingAward, setEditingAward] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const data = await getAwards();
        if (!c) setAwards(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!c) setAwardsLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (nbPreview) URL.revokeObjectURL(nbPreview);
      if (naPreview) URL.revokeObjectURL(naPreview);
    };
  }, [nbPreview, naPreview]);

  const loadingIcon = useMemo(
    () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
    []
  );

  /* ============== Text submit handlers (rapi, tombol di kanan) ============== */
  async function handleSave(
    fn: () => Promise<boolean>,
    okMsg: string,
    errMsg: string
  ) {
    setIsSubmitting(true);
    try {
      const ok = await fn();
      ok ? toast.success(okMsg) : toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ================= Header ================= */
  const saveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(
      () => setTitle(title),
      "Title berhasil diperbarui!",
      "Gagal memperbarui title"
    );
  };
  const saveSubtitle = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(
      () => setSubtitle(subtitle),
      "Subtitle berhasil diperbarui!",
      "Gagal memperbarui subtitle"
    );
  };
  const changeHeaderImg = async (file: File) => {
    setIsSubmitting(true);
    try {
      const url = await uploadImage(file, "header");
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

  /* ================= History ================= */
  const saveHistory = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(
      () => setHistoryText(historyText),
      "Teks sejarah berhasil diperbarui!",
      "Gagal memperbarui teks sejarah"
    );
  };
  const saveDisclaimer = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(
      () => setDisclaimerText(disclaimerText),
      "Teks disclaimer berhasil diperbarui!",
      "Gagal memperbarui teks disclaimer"
    );
  };
  const changeSanctuaryImg = async (file: File) => {
    setIsSubmitting(true);
    try {
      const url = await uploadImage(file, "sanctuary");
      const ok = await setSanctuaryImage(url);
      if (ok) {
        setSanctuaryImageState(url);
        toast.success("Gambar sanctuary berhasil diperbarui!");
      } else toast.error("Gagal menyimpan URL sanctuary");
    } catch (e: any) {
      toast.error(e?.message || "Upload gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= Barbers ================= */
  const onBarberImage = (file: File) => {
    setNbFile(file);
    const url = URL.createObjectURL(file);
    setNbPreview(url);
  };
  const addBarberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nbName || !nbPosition || !nbFile)
      return toast.error("Nama, Posisi, dan Foto wajib diisi");
    setIsSubmitting(true);
    try {
      const url = await uploadImage(nbFile, "barbers");
      const id = await addBarber({
        name: nbName,
        position: nbPosition,
        imageUrl: url,
      });
      setBarbers((p) => [
        ...p,
        { id, name: nbName, position: nbPosition, imageUrl: url },
      ]);
      setNbName("");
      setNbPosition("");
      setNbFile(null);
      if (nbPreview) URL.revokeObjectURL(nbPreview);
      setNbPreview("");
      toast.success("Barber berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan barber");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveBarber = async (id: string) => {
    const b = barbers.find((x) => x.id === id);
    if (!b) return;
    setIsSubmitting(true);
    try {
      await updateBarber(id, { name: b.name, position: b.position });
      setEditingBarber(null);
      toast.success("Barber berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui barber");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delBarber = async (id: string) => {
    if (!confirm("Hapus barber ini?")) return;
    setIsSubmitting(true);
    try {
      await deleteBarber(id);
      setBarbers((p) => p.filter((x) => x.id !== id));
      toast.success("Barber berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus barber");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= Gallery ================= */
  const addGallery = async (file: File) => {
    setIsSubmitting(true);
    try {
      const url = await uploadImage(file, "gallery");
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

  /* ================= Video ================= */
  const saveVideoTitle = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(
      () => setVideoTitle(videoTitle),
      "Judul video berhasil diperbarui!",
      "Gagal memperbarui judul video"
    );
  };
  const uploadNewVideo = async (file: File) => {
    setIsSubmitting(true);
    try {
      const url = await uploadVideo(file);
      const id = await addVideo(url);
      const nv = { id, url };
      setVideos((p) => [...p, nv]);
      if (!mainVideo) {
        await setMainVideo(nv);
        setMainVideoState(nv);
        toast.success("Video dijadikan video utama!");
      } else {
        toast.success("Video berhasil ditambahkan!");
      }
    } catch (e: any) {
      toast.error(e?.message || "Gagal upload video");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delVideo = async (id: string) => {
    if (!confirm("Hapus video ini?")) return;
    setIsSubmitting(true);
    try {
      if (mainVideo && mainVideo.id === id && id === "main-video") {
        await setMainVideo({ id: "", url: "" } as any);
        setMainVideoState(null);
      } else {
        await deleteVideo(id);
        setVideos((p) => p.filter((v) => v.id !== id));
        if (mainVideo && mainVideo.id === id) {
          await setMainVideo({ id: "", url: "" } as any);
          setMainVideoState(null);
        }
      }
      toast.success("Video berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus video");
    } finally {
      setIsSubmitting(false);
    }
  };
  const setAsMain = async (v: Video) => {
    setIsSubmitting(true);
    try {
      await setMainVideo(v);
      setMainVideoState(v);
      toast.success("Video utama berhasil diubah!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengubah video utama");
    } finally {
      setIsSubmitting(false);
    }
  };
  const togglePreview = (id: string) => {
    const all = [mainVideo, ...videos].filter(Boolean) as Video[];
    all.forEach((v) => {
      const el = document.getElementById(
        `vid-${v.id}`
      ) as HTMLVideoElement | null;
      if (el && v.id !== id) el.pause();
    });
    const me = document.getElementById(`vid-${id}`) as HTMLVideoElement | null;
    if (!me) return;
    if (me.paused) {
      me.play();
      setPlayingPreview(id);
    } else {
      me.pause();
      setPlayingPreview(null);
    }
  };

  /* ================= Awards ================= */
  const onAwardImage = (file: File) => {
    setNaFile(file);
    const url = URL.createObjectURL(file);
    setNaPreview(url);
  };
  const addAwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naName || !naFile) return toast.error("Nama & Logo wajib diisi");
    setIsSubmitting(true);
    try {
      const url = await uploadImage(naFile, "awards");
      const id = await addAward({ name: naName, imageUrl: url });
      setAwards((p) => [...p, { id, name: naName, imageUrl: url }]);
      setNaName("");
      setNaFile(null);
      if (naPreview) URL.revokeObjectURL(naPreview);
      setNaPreview("");
      toast.success("Award berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan award");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveAward = async (id: string) => {
    const a = awards.find((x) => x.id === id);
    if (!a) return;
    setIsSubmitting(true);
    try {
      await updateAward(id, { name: a.name });
      setEditingAward(null);
      toast.success("Award berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui award");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delAward = async (id: string) => {
    if (!confirm("Hapus award ini?")) return;
    setIsSubmitting(true);
    try {
      await deleteAward(id);
      setAwards((p) => p.filter((x) => x.id !== id));
      toast.success("Award berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus award");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-[100dvh] bg-black text-white p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold">Dashboard Sanctuary</h1>
      <p className="text-neutral-400 mt-1 mb-6">
        Kelola konten untuk halaman Sanctuary.
      </p>

      {/* Sticky Tabs */}
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
              value="history"
            >
              Sejarah &amp; Disclaimer
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="barbers"
            >
              Para Capsters
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="gallery"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="video"
            >
              Video
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="awards"
            >
              Awards
            </TabsTrigger>
          </TabsList>

          {/* ===== HEADER ===== */}
          <TabsContent value="header" className="pt-6">
            <div className="flex flex-col gap-6">
              {/* Texts */}
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

              {/* Image */}
              <div className="md:col-span-2">
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
            </div>
          </TabsContent>

          {/* ===== HISTORY ===== */}
          <TabsContent value="history" className="pt-6">
            <div className="flex flex-col gap-6">
              <Section
                title="Sejarah & Disclaimer"
                desc="Konten utama penjelasan brand"
              >
                <div className="grid gap-6">
                  <form onSubmit={saveHistory} className="grid gap-2">
                    <Label htmlFor="history">Teks Sejarah</Label>
                    <Textarea
                      id="history"
                      value={historyText}
                      onChange={(e) => setHistoryTextState(e.target.value)}
                      className="min-h-[180px] bg-neutral-950 border-neutral-800 text-white"
                    />
                    <div className="flex justify-end">
                      <Button variant="destructive" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>{loadingIcon}Menyimpan…</>
                        ) : (
                          "Simpan Teks Sejarah"
                        )}
                      </Button>
                    </div>
                  </form>

                  <form onSubmit={saveDisclaimer} className="grid gap-2">
                    <Label htmlFor="disc">Teks Disclaimer</Label>
                    <Textarea
                      id="disc"
                      value={disclaimerText}
                      onChange={(e) => setDisclaimerTextState(e.target.value)}
                      className="min-h-[140px] bg-neutral-950 border-neutral-800 text-white"
                    />
                    <div className="flex justify-end">
                      <Button variant="destructive" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>{loadingIcon}Menyimpan…</>
                        ) : (
                          "Simpan Teks Disclaimer"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </Section>

              <div className="md:col-span-2">
                <Section
                  title="Sanctuary Image"
                  desc="Gambar pendamping pada section sejarah"
                >
                  <MediaFrame
                    src={sanctuaryImage}
                    emptyText="Belum ada gambar"
                    onChangeClickId="sanc-img"
                    onFileSelected={changeSanctuaryImg}
                    disabled={isSubmitting}
                    aspect="aspect-[16/9]"
                  />
                </Section>
              </div>
            </div>
          </TabsContent>

          {/* ===== BARBERS ===== */}
          <TabsContent value="barbers" className="pt-6">
            <div className="grid gap-6">
              <Section title="Tambah Barber" desc="Tambah data capster baru">
                <form onSubmit={addBarberSubmit} className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="nbName">Nama</Label>
                      <Input
                        id="nbName"
                        value={nbName}
                        onChange={(e) => setNbName(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nbPos">Posisi</Label>
                      <Input
                        id="nbPos"
                        value={nbPosition}
                        onChange={(e) => setNbPosition(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Foto</Label>
                      <FileTrigger
                        id="nb-file"
                        label="Pilih Foto"
                        accept="image/*"
                        onFileSelected={(f) => {
                          setNbFile(f);
                          const u = URL.createObjectURL(f);
                          if (nbPreview) URL.revokeObjectURL(nbPreview);
                          setNbPreview(u);
                        }}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {nbPreview ? (
                    <div className="relative w-full h-40 rounded-md overflow-hidden border border-neutral-800 bg-black">
                      <Image
                        src={nbPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={
                        isSubmitting || !nbName || !nbPosition || !nbFile
                      }
                    >
                      {isSubmitting ? (
                        <>{loadingIcon}Menambahkan…</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah Barber
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Section>

              <Section title="Daftar Barber">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {barbers.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                    >
                      <div className="relative w-full h-44 rounded-md overflow-hidden border border-neutral-800 mb-3">
                        <Image
                          src={b.imageUrl}
                          alt={b.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {editingBarber === b.id ? (
                        <div className="grid gap-2">
                          <Input
                            value={b.name}
                            onChange={(e) =>
                              setBarbers((p) =>
                                p.map((x) =>
                                  x.id === b.id
                                    ? { ...x, name: e.target.value }
                                    : x
                                )
                              )
                            }
                            className="bg-neutral-950 border-neutral-800 text-white"
                          />
                          <Input
                            value={b.position}
                            onChange={(e) =>
                              setBarbers((p) =>
                                p.map((x) =>
                                  x.id === b.id
                                    ? { ...x, position: e.target.value }
                                    : x
                                )
                              )
                            }
                            className="bg-neutral-950 border-neutral-800 text-white"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-black"
                              onClick={() => setEditingBarber(null)}
                            >
                              Batal
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => saveBarber(b.id)}
                              disabled={isSubmitting}
                            >
                              Simpan
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h3 className="font-medium">{b.name}</h3>
                            <p className="text-sm text-neutral-400">
                              {b.position}
                            </p>
                          </div>
                          <div className="flex gap-2 justify-end mt-3">
                            <Button
                              variant="outline"
                              className="text-black"
                              size="sm"
                              onClick={() => setEditingBarber(b.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => delBarber(b.id)}
                              disabled={isSubmitting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
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
                  Upload gambar hasil potongan untuk tampil di halaman klien.
                </p>
              </Section>

              <Section title="Daftar Gallery">
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
                </div>
              </Section>
            </div>
          </TabsContent>

          {/* ===== VIDEO ===== */}
          <TabsContent value="video" className="pt-6">
            <div className="grid gap-6">
              <Section
                title="Pengaturan Video"
                desc="Judul section & upload video"
              >
                <form
                  onSubmit={saveVideoTitle}
                  className="grid gap-4 md:grid-cols-3"
                >
                  <div className="md:col-span-2 grid gap-2">
                    <Label htmlFor="vt">Judul Section</Label>
                    <Input
                      id="vt"
                      value={videoTitle}
                      onChange={(e) => setVideoTitleState(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-white"
                    />
                    {initialVideoUrl ? (
                      <p className="text-xs text-neutral-500">
                        *Legacy `videoUrl` terdeteksi. Gunakan daftar video di
                        bawah.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-end justify-end">
                    <Button variant="destructive" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>{loadingIcon}Menyimpan…</>
                      ) : (
                        "Simpan Judul"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 flex justify-between items-center">
                  <span className="text-sm text-neutral-400">
                    Upload video MP4 untuk slider.
                  </span>
                  <FileTrigger
                    id="vid-file"
                    label={isSubmitting ? "Uploading…" : "Upload Video"}
                    onFileSelected={uploadNewVideo}
                    accept="video/mp4"
                    disabled={isSubmitting}
                  />
                </div>
              </Section>

              {mainVideo ? (
                <Section title="Video Utama">
                  <div className="grid gap-3">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-neutral-800 bg-black">
                      <video
                        id={`vid-${mainVideo.id}`}
                        className="w-full h-full"
                        loop
                      >
                        <source src={mainVideo.url} type="video/mp4" />
                      </video>
                      {playingPreview !== mainVideo.id && (
                        <div
                          className="absolute inset-0 grid place-items-center bg-black/50 cursor-pointer"
                          onClick={() => togglePreview(mainVideo.id)}
                        >
                          <Play className="h-14 w-14 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-black"
                        onClick={() => togglePreview(mainVideo.id)}
                      >
                        {playingPreview === mainVideo.id ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" /> Play
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => delVideo(mainVideo.id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Section>
              ) : null}

              <Section title="Video Lainnya">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos
                    .filter((v) => !mainVideo || v.id !== mainVideo.id)
                    .map((v) => (
                      <div
                        key={v.id}
                        className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded-md border border-neutral-800 mb-3">
                          <video
                            id={`vid-${v.id}`}
                            className="w-full h-full"
                            loop
                          >
                            <source src={v.url} type="video/mp4" />
                          </video>
                          {playingPreview !== v.id && (
                            <div
                              className="absolute inset-0 grid place-items-center bg-black/50 cursor-pointer"
                              onClick={() => togglePreview(v.id)}
                            >
                              <Play className="h-12 w-12 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-black"
                              onClick={() => togglePreview(v.id)}
                            >
                              {playingPreview === v.id ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" /> Pause
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" /> Play
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-black"
                              onClick={() => setAsMain(v)}
                              disabled={isSubmitting}
                            >
                              <ArrowUp className="mr-2 h-4 w-4" /> Set Utama
                            </Button>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => delVideo(v.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>

                {(!videos.length || (videos.length === 1 && mainVideo)) && (
                  <div className="text-center p-8 border border-dashed border-neutral-800 rounded-md mt-6">
                    <p className="text-neutral-500">Belum ada video tambahan</p>
                  </div>
                )}
              </Section>
            </div>
          </TabsContent>

          {/* ===== AWARDS ===== */}
          <TabsContent value="awards" className="pt-6">
            <div className="grid gap-6">
              <Section title="Tambah Award">
                <form onSubmit={addAwardSubmit} className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2 grid gap-2">
                      <Label htmlFor="naName">Nama</Label>
                      <Input
                        id="naName"
                        value={naName}
                        onChange={(e) => setNaName(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Logo</Label>
                      <FileTrigger
                        id="aw-file"
                        label="Pilih Logo"
                        onFileSelected={onAwardImage}
                        accept="image/*"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  {naPreview ? (
                    <div className="relative w-full h-32 rounded-md overflow-hidden border border-neutral-800 bg-black">
                      <Image
                        src={naPreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : null}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isSubmitting || !naName || !naFile}
                    >
                      {isSubmitting ? (
                        <>{loadingIcon}Menambahkan…</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah Award
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Section>

              <Section title="Daftar Awards">
                {awardsLoading ? (
                  <div className="h-24 grid place-items-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : !awards.length ? (
                  <div className="text-center p-8 border border-dashed border-neutral-800 rounded-md">
                    <p className="text-neutral-500">
                      Belum ada data OUR COLLABORATIONS
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {awards.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                      >
                        <div className="relative w-full h-32 rounded-md overflow-hidden border border-neutral-800 bg-black mb-3">
                          <Image
                            src={a.imageUrl}
                            alt={a.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        {editingAward === a.id ? (
                          <div className="grid gap-2">
                            <Input
                              value={a.name}
                              onChange={(e) =>
                                setAwards((p) =>
                                  p.map((x) =>
                                    x.id === a.id
                                      ? { ...x, name: e.target.value }
                                      : x
                                  )
                                )
                              }
                              className="bg-neutral-950 border-neutral-800 text-white"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-black"
                                onClick={() => setEditingAward(null)}
                              >
                                Batal
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => saveAward(a.id)}
                                disabled={isSubmitting}
                              >
                                Simpan
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-medium text-center">
                              {a.name}
                            </h3>
                            <div className="flex gap-2 justify-center mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-black"
                                onClick={() => setEditingAward(a.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => delAward(a.id)}
                                disabled={isSubmitting}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ===== Aliases supaya saveTitle/saveSubtitle singkat ===== */
async function setTitle(val: string) {
  return await setTitleFn(val);
}
async function setSubtitle(val: string) {
  return await setSubtitleFn(val);
}
