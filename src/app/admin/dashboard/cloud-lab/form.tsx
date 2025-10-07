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
  setTitle,
  setSubtitle,
  getProducts,
  getPartners,
  uploadImage,
  setHeaderImage,
  addProduct,
  updateProduct,
  deleteProduct,
  addPartner,
  updatePartner,
  deletePartner,
} from "@/services/cloud-lab";

/* ===================== Small UI helpers ===================== */
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

/* ===================== Types ===================== */
type Prod = {
  id: string;
  name: string;
  imageUrl: string;
  shopee?: string;
  tokped?: string;
};
type Partner = Prod;

/* ===================== Main ===================== */
export function DashboardCloudLabClient({
  initialTitle,
  initialSubtitle,
  initialHeaderImage,
  initialProducts,
  initialPartners,
}: {
  initialTitle: string;
  initialSubtitle: string;
  initialHeaderImage: string;
  initialProducts: Prod[];
  initialPartners: Partner[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Header
  const [title, setTitleState] = useState(initialTitle);
  const [subtitle, setSubtitleState] = useState(initialSubtitle);
  const [headerImage, setHeaderImageState] = useState(initialHeaderImage);

  // Products & Partners
  const [products, setProducts] = useState<Prod[]>(initialProducts || []);
  const [partners, setPartners] = useState<Partner[]>(initialPartners || []);
  const [loadingLists, setLoadingLists] = useState(false);

  // Add Product form
  const [npName, setNpName] = useState("");
  const [npTokped, setNpTokped] = useState("");
  const [npShopee, setNpShopee] = useState("");
  const [npFile, setNpFile] = useState<File | null>(null);
  const [npPreview, setNpPreview] = useState("");

  // Add Partner form
  const [naName, setNaName] = useState("");
  const [naTokped, setNaTokped] = useState("");
  const [naShopee, setNaShopee] = useState("");
  const [naFile, setNaFile] = useState<File | null>(null);
  const [naPreview, setNaPreview] = useState("");

  const loadingIcon = useMemo(
    () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
    []
  );

  useEffect(() => {
    return () => {
      if (npPreview) URL.revokeObjectURL(npPreview);
      if (naPreview) URL.revokeObjectURL(naPreview);
    };
  }, [npPreview, naPreview]);

  // Optional: reload (kalau mau sync ulang dari server)
  async function reloadLists() {
    setLoadingLists(true);
    try {
      const [p, pr] = await Promise.all([getProducts(), getPartners()]);
      setProducts(p);
      setPartners(pr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLists(false);
    }
  }

  /* ================= Header Handlers ================= */
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
      const url = await uploadImage(file, "cloud-lab/header");
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

  /* ================= Products Handlers ================= */
  const onProdImage = (f: File) => {
    setNpFile(f);
    const u = URL.createObjectURL(f);
    if (npPreview) URL.revokeObjectURL(npPreview);
    setNpPreview(u);
  };
  const addProdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!npName || !npFile) return toast.error("Nama & Foto wajib diisi");
    setIsSubmitting(true);
    try {
      const url = await uploadImage(npFile, "cloud-lab/products");
      const id = await addProduct({
        name: npName,
        imageUrl: url,
        tokped: npTokped || "",
        shopee: npShopee || "",
      });
      setProducts((p) => [
        ...p,
        { id, name: npName, imageUrl: url, tokped: npTokped, shopee: npShopee },
      ]);
      setNpName("");
      setNpTokped("");
      setNpShopee("");
      setNpFile(null);
      if (npPreview) URL.revokeObjectURL(npPreview);
      setNpPreview("");
      toast.success("Product berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan product");
    } finally {
      setIsSubmitting(false);
    }
  };
  const saveProd = async (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setIsSubmitting(true);
    try {
      await updateProduct(id, {
        name: p.name,
        tokped: p.tokped || "",
        shopee: p.shopee || "",
      });
      toast.success("Product berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui product");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delProd = async (id: string) => {
    if (!confirm("Hapus product ini?")) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(id);
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success("Product berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus product");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= Partners Handlers ================= */
  const onPartnerImage = (f: File) => {
    setNaFile(f);
    const u = URL.createObjectURL(f);
    if (naPreview) URL.revokeObjectURL(naPreview);
    setNaPreview(u);
  };
  const addPartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naName || !naFile) return toast.error("Nama & Logo wajib diisi");
    setIsSubmitting(true);
    try {
      const url = await uploadImage(naFile, "cloud-lab/partners");
      const id = await addPartner({
        name: naName,
        imageUrl: url,
        tokped: naTokped || "",
        shopee: naShopee || "",
      });
      setPartners((p) => [
        ...p,
        { id, name: naName, imageUrl: url, tokped: naTokped, shopee: naShopee },
      ]);
      setNaName("");
      setNaTokped("");
      setNaShopee("");
      setNaFile(null);
      if (naPreview) URL.revokeObjectURL(naPreview);
      setNaPreview("");
      toast.success("Partner berhasil ditambahkan!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menambahkan partner");
    } finally {
      setIsSubmitting(false);
    }
  };
  const savePartner = async (id: string) => {
    const p = partners.find((x) => x.id === id);
    if (!p) return;
    setIsSubmitting(true);
    try {
      await updatePartner(id, {
        name: p.name,
        tokped: p.tokped || "",
        shopee: p.shopee || "",
      });
      toast.success("Partner berhasil diperbarui!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal memperbarui partner");
    } finally {
      setIsSubmitting(false);
    }
  };
  const delPartner = async (id: string) => {
    if (!confirm("Hapus partner ini?")) return;
    setIsSubmitting(true);
    try {
      await deletePartner(id);
      setPartners((p) => p.filter((x) => x.id !== id));
      toast.success("Partner berhasil dihapus!");
    } catch (e: any) {
      toast.error(e?.message || "Gagal menghapus partner");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-[100dvh] bg-black text-white p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl md:text-4xl font-bold">Dashboard .Cloud Lab</h1>
      <p className="text-neutral-400 mt-1 mb-6">
        Kelola konten untuk halaman .Cloud Lab.
      </p>

      {/* Tabs sticky */}
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
              value="products"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="partners"
            >
              Partners
            </TabsTrigger>
          </TabsList>

          {/* ========== HEADER ========== */}
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
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan…
                          </>
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
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan…
                          </>
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

          {/* ========== PRODUCTS ========== */}
          <TabsContent value="products" className="pt-6">
            <div className="grid gap-6">
              <Section
                title="Tambah Product"
                desc="Tambah item baru ke Our Product"
              >
                <form onSubmit={addProdSubmit} className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="npName">Nama</Label>
                      <Input
                        id="npName"
                        value={npName}
                        onChange={(e) => setNpName(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="npTokped">Link Tokopedia</Label>
                      <Input
                        id="npTokped"
                        value={npTokped}
                        onChange={(e) => setNpTokped(e.target.value)}
                        placeholder="https://tokopedia.com/..."
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="npShopee">Link Shopee</Label>
                      <Input
                        id="npShopee"
                        value={npShopee}
                        onChange={(e) => setNpShopee(e.target.value)}
                        placeholder="https://shopee.co.id/..."
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Foto</Label>
                    <FileTrigger
                      id="np-file"
                      label="Pilih Foto"
                      accept="image/*"
                      onFileSelected={onProdImage}
                      disabled={isSubmitting}
                    />
                  </div>

                  {npPreview ? (
                    <div className="relative w-full h-40 rounded-md overflow-hidden border border-neutral-800 bg-black">
                      <Image
                        src={npPreview}
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
                      disabled={isSubmitting || !npName || !npFile}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menambahkan…
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah Product
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Section>

              <Section
                title="Daftar Product"
                right={
                  <Button
                    variant="outline"
                    className="text-black"
                    onClick={reloadLists}
                    disabled={loadingLists}
                  >
                    {loadingLists ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Reload…
                      </>
                    ) : (
                      "Reload"
                    )}
                  </Button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
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

                      <div className="grid gap-2">
                        <Label>Nama</Label>
                        <Input
                          value={p.name}
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, name: e.target.value }
                                  : x
                              )
                            )
                          }
                          className="bg-neutral-950 border-neutral-800 text-white"
                        />
                        <Label>Tokopedia</Label>
                        <Input
                          value={p.tokped || ""}
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, tokped: e.target.value }
                                  : x
                              )
                            )
                          }
                          placeholder="https://tokopedia.com/..."
                          className="bg-neutral-950 border-neutral-800 text-white"
                        />
                        <Label>Shopee</Label>
                        <Input
                          value={p.shopee || ""}
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, shopee: e.target.value }
                                  : x
                              )
                            )
                          }
                          placeholder="https://shopee.co.id/..."
                          className="bg-neutral-950 border-neutral-800 text-white"
                        />
                        <div className="flex gap-2 justify-end mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-black"
                            onClick={() => saveProd(p.id)}
                            disabled={isSubmitting}
                          >
                            Simpan
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => delProd(p.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!products.length && (
                    <div className="col-span-full text-center p-8 border border-dashed border-neutral-800 rounded-md">
                      <p className="text-neutral-500">Belum ada product</p>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </TabsContent>

          {/* ========== PARTNERS ========== */}
          <TabsContent value="partners" className="pt-6">
            <div className="grid gap-6">
              <Section
                title="Tambah Partner"
                desc="Tambah item baru ke Our Partner"
              >
                <form onSubmit={addPartnerSubmit} className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="naName">Nama</Label>
                      <Input
                        id="naName"
                        value={naName}
                        onChange={(e) => setNaName(e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="naTokped">Link Tokopedia</Label>
                      <Input
                        id="naTokped"
                        value={naTokped}
                        onChange={(e) => setNaTokped(e.target.value)}
                        placeholder="https://tokopedia.com/..."
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="naShopee">Link Shopee</Label>
                      <Input
                        id="naShopee"
                        value={naShopee}
                        onChange={(e) => setNaShopee(e.target.value)}
                        placeholder="https://shopee.co.id/..."
                        className="bg-neutral-950 border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Logo</Label>
                    <FileTrigger
                      id="na-file"
                      label="Pilih Logo"
                      accept="image/*"
                      onFileSelected={onPartnerImage}
                      disabled={isSubmitting}
                    />
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
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menambahkan…
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" /> Tambah Partner
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Section>

              <Section
                title="Daftar Partners"
                right={
                  <Button
                    variant="outline"
                    className="text-black"
                    onClick={reloadLists}
                    disabled={loadingLists}
                  >
                    {loadingLists ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Reload…
                      </>
                    ) : (
                      "Reload"
                    )}
                  </Button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partners.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                    >
                      <div className="relative w-full h-32 rounded-md overflow-hidden border border-neutral-800 bg-black mb-3">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Nama</Label>
                        <Input
                          value={p.name}
                          onChange={(e) =>
                            setPartners((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, name: e.target.value }
                                  : x
                              )
                            )
                          }
                          className="bg-neutral-950 border-neutral-800 text-white"
                        />
                        <Label>Tokopedia</Label>
                        <Input
                          value={p.tokped || ""}
                          onChange={(e) =>
                            setPartners((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, tokped: e.target.value }
                                  : x
                              )
                            )
                          }
                          placeholder="https://tokopedia.com/..."
                          className="bg-neutral-950 border-neutral-800 text-white"
                        />
                        <Label>Shopee</Label>
                        <Input
                          value={p.shopee || ""}
                          onChange={(e) =>
                            setPartners((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, shopee: e.target.value }
                                  : x
                              )
                            )
                          }
                          placeholder="https://shopee.co.id/..."
                          className="bg-neutral-950 border-neutral-800 text-white"
                        />
                        <div className="flex gap-2 justify-end mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-black"
                            onClick={() => savePartner(p.id)}
                            disabled={isSubmitting}
                          >
                            Simpan
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => delPartner(p.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!partners.length && (
                    <div className="col-span-full text-center p-8 border border-dashed border-neutral-800 rounded-md">
                      <p className="text-neutral-500">Belum ada partner</p>
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
