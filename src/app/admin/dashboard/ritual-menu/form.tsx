/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
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
import { Loader2, Plus, Trash2 } from "lucide-react";

import {
  setTitle as setTitleFn,
  setSubtitle as setSubtitleFn,
  setHeaderImage,
  uploadImage,
  // Services
  addService,
  deleteService,
  getServices,
  updateService,
  // Memberships
  addMembership,
  deleteMembership,
  getMemberships,
  updateMembership,
  // Footer / CTA
  setBookingTitle,
  setBookingCtaText,
} from "@/services/ritual-menu";

/* ================= Types ================= */
type Service = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  order?: number;
};

type Membership = {
  id: string;
  duration: string; // ex: "3 Bulan"
  benefits: string[];
  imageUrl?: string;
};

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
  aspect = "aspect-[16/9]",
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
export function DashboardRitualMenusClient({
  initialTitle,
  initialSubtitle,
  initialHeaderImage,
  initialServices,
  initialMemberships,
  initialBookingTitle,
  initialBookingCtaText,
}: {
  initialTitle: string;
  initialSubtitle: string;
  initialHeaderImage: string;
  initialServices: Service[];
  initialMemberships: Membership[];
  initialBookingTitle: string;
  initialBookingCtaText: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitleState] = useState(initialTitle || "Ritual Menu's");
  const [subtitle, setSubtitleState] = useState(
    initialSubtitle || "Temukan layanan dan program membership eksklusif."
  );
  const [headerImage, setHeaderImageState] = useState(initialHeaderImage || "");

  // Services
  const [services, setServices] = useState<Service[]>(
    (initialServices || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  );
  const [svName, setSvName] = useState("");
  const [svDesc, setSvDesc] = useState("");
  const [svFile, setSvFile] = useState<File | null>(null);
  const [svPreview, setSvPreview] = useState("");

  // Memberships
  const [memberships, setMemberships] = useState<Membership[]>(
    initialMemberships || []
  );
  const [mbDuration, setMbDuration] = useState("");
  const [mbBenefitsText, setMbBenefitsText] = useState(""); // satu per baris / koma
  const [mbFile, setMbFile] = useState<File | null>(null);
  const [mbPreview, setMbPreview] = useState("");

  // Footer CTA
  const [bookingTitle, setBookingTitleState] = useState(
    initialBookingTitle || "Booking & Ask Us for Price"
  );
  const [bookingCtaText, setBookingCtaTextState] = useState(
    initialBookingCtaText || "Hubungi Kami"
  );

  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingMembership, setEditingMembership] = useState<string | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (svPreview) URL.revokeObjectURL(svPreview);
      if (mbPreview) URL.revokeObjectURL(mbPreview);
    };
  }, [svPreview, mbPreview]);

  const loadingIcon = useMemo(
    () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
    []
  );

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

  /* ========== HEADER ========== */
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
      const url = await uploadImage(file, "ritual-menu/header");
      const ok = await setHeaderImage(url);
      if (ok) {
        setHeaderImageState(url);
        toast.success("Gambar header berhasil diperbarui!");
      } else {
        toast.error("Gagal menyimpan URL header");
      }
    } catch (e: any) {
      toast.error(e?.message || "Upload gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ========== SERVICES CRUD ========== */
  const addServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!svName || !svDesc || !svFile) {
      toast.error("Nama, Deskripsi, dan Gambar wajib diisi");
      return;
    }
    setIsSubmitting(true);
    try {
      const url = await uploadImage(svFile, "ritual-menu/services");
      const order = (services?.length || 0) + 1;
      const id = await addService({
        name: svName,
        description: svDesc,
        imageUrl: url,
        order,
      });
      setServices((p) => [
        ...p,
        { id, name: svName, description: svDesc, imageUrl: url, order },
      ]);
      setSvName("");
      setSvDesc("");
      setSvFile(null);
      if (svPreview) URL.revokeObjectURL(svPreview);
      setSvPreview("");
      toast.success("Service berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveService = async (id: string) => {
    const s = services.find((x) => x.id === id);
    if (!s) return;
    setIsSubmitting(true);
    try {
      await updateService(id, {
        name: s.name,
        description: s.description,
        order: s.order ?? 0,
      });
      setEditingService(null);
      toast.success("Service berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const delService = async (id: string) => {
    if (!confirm("Hapus service ini?")) return;
    setIsSubmitting(true);
    try {
      await deleteService(id);
      setServices((p) => p.filter((x) => x.id !== id));
      toast.success("Service berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus service");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ========== MEMBERSHIP CRUD ========== */
  const addMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mbDuration) {
      toast.error("Durasi wajib diisi");
      return;
    }
    const benefits = mbBenefitsText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      let url: string | undefined;
      if (mbFile) {
        url = await uploadImage(mbFile, "ritual-menu/memberships");
      }
      const id = await addMembership({
        duration: mbDuration,
        benefits,
        imageUrl: url,
      });
      setMemberships((p) => [
        ...p,
        { id, duration: mbDuration, benefits, imageUrl: url },
      ]);
      setMbDuration("");
      setMbBenefitsText("");
      setMbFile(null);
      if (mbPreview) URL.revokeObjectURL(mbPreview);
      setMbPreview("");
      toast.success("Membership berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan membership");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveMembership = async (id: string) => {
    const m = memberships.find((x) => x.id === id);
    if (!m) return;
    setIsSubmitting(true);
    try {
      await updateMembership(id, {
        duration: m.duration,
        benefits: m.benefits,
      });
      setEditingMembership(null);
      toast.success("Membership berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui membership");
    } finally {
      setIsSubmitting(false);
    }
  };

  const delMembership = async (id: string) => {
    if (!confirm("Hapus membership ini?")) return;
    setIsSubmitting(true);
    try {
      await deleteMembership(id);
      setMemberships((p) => p.filter((x) => x.id !== id));
      toast.success("Membership berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus membership");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ========== FOOTER CTA ========== */
  const saveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(
      async () => {
        const ok1 = await setBookingTitle(bookingTitle);
        const ok2 = await setBookingCtaText(bookingCtaText);
        return ok1 && ok2;
      },
      "CTA Booking berhasil diperbarui!",
      "Gagal memperbarui CTA Booking"
    );
  };

  /* ========== UI ========== */
  return (
    <div className="min-h-[100dvh] bg-black text-white p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl md:text-4xl font-bold">Dashboard Ritual Menus</h1>
      <p className="text-neutral-400 mt-1 mb-6">
        Kelola konten halaman Ritual Menu&apos;s.
      </p>

      <Tabs defaultValue="header" className="w-full">
        {/* Sticky Tabs */}
        <div className="sticky top-0 z-20 -mx-6 md:-mx-8 px-6 md:px-8 py-3 bg-black/70 backdrop-blur">
          <TabsList className="bg-neutral-900/60 border border-neutral-800">
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="header"
            >
              Header
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="services"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="membership"
            >
              Membership
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="footer"
            >
              Footer (CTA)
            </TabsTrigger>
          </TabsList>
        </div>

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
              desc="Gambar besar bagian atas halaman"
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

        {/* ===== SERVICES ===== */}
        <TabsContent value="services" className="pt-6">
          <div className="grid gap-6">
            <Section
              title="Tambah Service"
              desc="Layanan yang tampil di slider/daftar"
            >
              <form onSubmit={addServiceSubmit} className="grid gap-4">
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="svName">Nama</Label>
                    <Input
                      id="svName"
                      value={svName}
                      onChange={(e) => setSvName(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-white"
                    />
                  </div>
                  <div className="md:col-span-2 grid gap-2">
                    <Label htmlFor="svDesc">Deskripsi</Label>
                    <Textarea
                      id="svDesc"
                      value={svDesc}
                      onChange={(e) => setSvDesc(e.target.value)}
                      className="min-h-[90px] bg-neutral-950 border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <FileTrigger
                    id="sv-file"
                    label="Pilih Gambar"
                    accept="image/*"
                    onFileSelected={(f) => {
                      setSvFile(f);
                      const u = URL.createObjectURL(f);
                      if (svPreview) URL.revokeObjectURL(svPreview);
                      setSvPreview(u);
                    }}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isSubmitting || !svName || !svDesc || !svFile}
                  >
                    {isSubmitting ? (
                      <>{loadingIcon}Menambahkan…</>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Service
                      </>
                    )}
                  </Button>
                </div>

                {svPreview ? (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border border-neutral-800 bg-black">
                    <Image
                      src={svPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </form>
            </Section>

            <Section title="Daftar Services">
              {!services.length ? (
                <div className="text-center p-8 border border-dashed border-neutral-800 rounded-md">
                  <p className="text-neutral-500">Belum ada service</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((s) => (
                      <div
                        key={s.id}
                        className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                      >
                        <div className="relative w-full h-44 rounded-md overflow-hidden border border-neutral-800 mb-3">
                          <Image
                            src={s.imageUrl}
                            alt={s.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {editingService === s.id ? (
                          <div className="grid gap-2">
                            <Input
                              value={s.name}
                              onChange={(e) =>
                                setServices((p) =>
                                  p.map((x) =>
                                    x.id === s.id
                                      ? { ...x, name: e.target.value }
                                      : x
                                  )
                                )
                              }
                              className="bg-neutral-950 border-neutral-800 text-white"
                            />
                            <Textarea
                              value={s.description}
                              onChange={(e) =>
                                setServices((p) =>
                                  p.map((x) =>
                                    x.id === s.id
                                      ? { ...x, description: e.target.value }
                                      : x
                                  )
                                )
                              }
                              className="min-h-[90px] bg-neutral-950 border-neutral-800 text-white"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <div className="grid gap-1">
                                <Label htmlFor={`ord-${s.id}`}>Order</Label>
                                <Input
                                  id={`ord-${s.id}`}
                                  type="number"
                                  value={s.order ?? 0}
                                  onChange={(e) =>
                                    setServices((p) =>
                                      p.map((x) =>
                                        x.id === s.id
                                          ? {
                                              ...x,
                                              order: Number(e.target.value),
                                            }
                                          : x
                                      )
                                    )
                                  }
                                  className="bg-neutral-950 border-neutral-800 text-white"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-black"
                                onClick={() => setEditingService(null)}
                              >
                                Batal
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => saveService(s.id)}
                                disabled={isSubmitting}
                              >
                                Simpan
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-medium">{s.name}</h3>
                            <p className="text-sm text-neutral-400 mb-2">
                              {s.description}
                            </p>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                className="text-black"
                                size="sm"
                                onClick={() => setEditingService(s.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => delService(s.id)}
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

        {/* ===== MEMBERSHIP ===== */}
        <TabsContent value="membership" className="pt-6">
          <div className="grid gap-6">
            <Section
              title="Tambah Membership"
              desc="Program membership & benefit"
            >
              <form onSubmit={addMembershipSubmit} className="grid gap-4">
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mbDuration">Durasi</Label>
                    <Input
                      id="mbDuration"
                      placeholder="Contoh: 3 Bulan"
                      value={mbDuration}
                      onChange={(e) => setMbDuration(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-white"
                    />
                  </div>
                  <div className="md:col-span-2 grid gap-2">
                    <Label htmlFor="mbBenefits">Benefits</Label>
                    <Textarea
                      id="mbBenefits"
                      placeholder="Satu per baris atau pisahkan dengan koma"
                      value={mbBenefitsText}
                      onChange={(e) => setMbBenefitsText(e.target.value)}
                      className="min-h-[120px] bg-neutral-950 border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <FileTrigger
                    id="mb-file"
                    label="Gambar Kartu"
                    accept="image/*"
                    onFileSelected={(f) => {
                      setMbFile(f);
                      const u = URL.createObjectURL(f);
                      if (mbPreview) URL.revokeObjectURL(mbPreview);
                      setMbPreview(u);
                    }}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={
                      isSubmitting || !mbDuration || !mbBenefitsText || !mbFile
                    }
                  >
                    {isSubmitting ? (
                      <>{loadingIcon}Menambahkan…</>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Membership
                      </>
                    )}
                  </Button>
                </div>

                {mbPreview ? (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border border-neutral-800 bg-black">
                    <Image
                      src={mbPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </form>
            </Section>

            <Section title="Daftar Membership">
              {!memberships.length ? (
                <div className="text-center p-8 border border-dashed border-neutral-800 rounded-md">
                  <p className="text-neutral-500">Belum ada membership</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {memberships.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                    >
                      <div className="relative w-full h-32 rounded-md overflow-hidden border border-neutral-800 bg-black mb-3">
                        <Image
                          src={
                            m.imageUrl ||
                            "https://res.cloudinary.com/dns2kdqbi/image/upload/v1743495812/membercard_haircoolest_f9jnel.jpg"
                          }
                          alt={m.duration}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {editingMembership === m.id ? (
                        <div className="grid gap-2">
                          <Input
                            value={m.duration}
                            onChange={(e) =>
                              setMemberships((p) =>
                                p.map((x) =>
                                  x.id === m.id
                                    ? { ...x, duration: e.target.value }
                                    : x
                                )
                              )
                            }
                            className="bg-neutral-950 border-neutral-800 text-white"
                          />
                          <Textarea
                            value={m.benefits.join("\n")}
                            onChange={(e) =>
                              setMemberships((p) =>
                                p.map((x) =>
                                  x.id === m.id
                                    ? {
                                        ...x,
                                        benefits: e.target.value
                                          .split(/\n|,/)
                                          .map((s) => s.trim())
                                          .filter(Boolean),
                                      }
                                    : x
                                )
                              )
                            }
                            className="min-h-[120px] bg-neutral-950 border-neutral-800 text-white"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-black"
                              onClick={() => setEditingMembership(null)}
                            >
                              Batal
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => saveMembership(m.id)}
                              disabled={isSubmitting}
                            >
                              Simpan
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium text-center">
                            {m.duration}
                          </h3>
                          <ul className="mt-2 list-disc list-inside text-sm text-neutral-300 space-y-1">
                            {m.benefits.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                          <div className="flex gap-2 justify-center mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-black"
                              onClick={() => setEditingMembership(m.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => delMembership(m.id)}
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

        {/* ===== FOOTER / CTA ===== */}
        <TabsContent value="footer" className="pt-6">
          <Section
            title="CTA Booking"
            desc="Judul & label tombol di bagian booking (halaman klien)."
          >
            <form onSubmit={saveBooking} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bkTitle">Judul Section</Label>
                <Input
                  id="bkTitle"
                  value={bookingTitle}
                  onChange={(e) => setBookingTitleState(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bkCta">Label Tombol</Label>
                <Input
                  id="bkCta"
                  value={bookingCtaText}
                  onChange={(e) => setBookingCtaTextState(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-white"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="destructive" disabled={isSubmitting}>
                  {isSubmitting ? <>{loadingIcon}Menyimpan…</> : "Simpan CTA"}
                </Button>
              </div>
            </form>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ===== Aliases supaya singkat ===== */
async function setTitle(val: string) {
  return await setTitleFn(val);
}
async function setSubtitle(val: string) {
  return await setSubtitleFn(val);
}
