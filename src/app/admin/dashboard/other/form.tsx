"use client";

import { useMemo, useState } from "react";
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

import {
  CheckCircle2,
  Instagram,
  Mail,
  MapPin,
  Loader2,
  RotateCcw,
  Eye,
  EyeOff,
  Link2,
} from "lucide-react";

import { setField } from "@/services";

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

function Row({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon ? (
        <div className="mt-2 grid h-8 w-8 place-items-center rounded-md border border-neutral-800 bg-neutral-900/70 text-neutral-200">
          {icon}
        </div>
      ) : null}
      <div className="flex-1">{children}</div>
    </div>
  );
}

/** simple URL checker */
function isUrl(s: string) {
  try {
    // allow without protocol (e.g., instagram.com/..)
    const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`;
    new URL(withProto);
    return true;
  } catch {
    return false;
  }
}

/** normalize instagram handle to full URL if user types @handle or handle only */
function normalizeInstagram(v: string) {
  const val = v.trim();
  if (!val) return "";
  if (val.startsWith("http")) return val;
  const handle = val.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

/** extract src from iframe/html string; fallback to raw if looks like URL */
function extractMapSrc(raw: string): {
  type: "iframe" | "url" | "none";
  src: string;
} {
  const val = raw.trim();
  if (!val) return { type: "none", src: "" };

  // <iframe ... src="..."></iframe>
  const m = val.match(/src=["']([^"']+)["']/i);
  if (m?.[1]) return { type: "iframe", src: m[1] };

  // if looks like url (maps, g.page, goo.gl/maps, etc)
  if (isUrl(val)) {
    const withProto = /^https?:\/\//i.test(val) ? val : `https://${val}`;
    return { type: "url", src: withProto };
  }

  return { type: "none", src: "" };
}

/* =============== Generic Field Editor =============== */
function FieldEditor({
  name,
  label,
  description,
  initialValue,
  type = "text",
  placeholder,
  normalize,
  validator,
  as = "input",
}: {
  name: string;
  label: string;
  description?: string;
  initialValue: string;
  type?: "text" | "email" | "url";
  placeholder?: string;
  normalize?: (v: string) => string;
  validator?: (v: string) => boolean;
  as?: "input" | "textarea";
}) {
  const [value, setValue] = useState(initialValue || "");
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);

  const dirty = value !== (initialValue || "");

  const valid = useMemo(() => {
    if (!validator) return true;
    return validator(value);
  }, [value, validator]);

  async function onSave() {
    try {
      setBusy(true);
      const v = normalize ? normalize(value) : value;
      const ok = await setField(name, v);
      if (ok) {
        toast.success(`${label} berhasil diperbarui!`);
      } else {
        toast.error(`Gagal menyimpan ${label}`);
      }
    } catch (e) {
      toast.error(`Terjadi kesalahan saat menyimpan ${label}`);
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  function onReset() {
    setValue(initialValue || "");
    setTouched(false);
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      {description ? (
        <p className="text-xs text-neutral-400">{description}</p>
      ) : null}

      {as === "textarea" ? (
        <Textarea
          id={name}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setTouched(true);
          }}
          placeholder={placeholder}
          className="min-h-[120px] bg-neutral-950 border-neutral-800 text-white"
        />
      ) : (
        <Input
          id={name}
          type={type}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setTouched(true);
          }}
          placeholder={placeholder}
          className={`bg-neutral-950 border-neutral-800 text-white ${
            touched && !valid
              ? "border-red-500 focus-visible:ring-red-500/40"
              : ""
          }`}
        />
      )}

      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-black"
          onClick={onReset}
          disabled={busy || !dirty}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>

        <Button
          variant="destructive"
          onClick={onSave}
          disabled={busy || !dirty || !valid}
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan…
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Simpan
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* =============== Map Editor (dengan Preview) =============== */
function MapEditor({
  name,
  label,
  initialValue,
  placeholder,
}: {
  name: string;
  label: string;
  initialValue: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(initialValue || "");
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const dirty = value !== (initialValue || "");

  const parsed = useMemo(() => extractMapSrc(value), [value]);

  async function onSave() {
    try {
      setBusy(true);
      const ok = await setField(name, value);
      if (ok) toast.success(`${label} berhasil diperbarui!`);
      else toast.error(`Gagal menyimpan ${label}`);
    } catch (e) {
      toast.error(`Terjadi kesalahan saat menyimpan ${label}`);
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  function onReset() {
    setValue(initialValue || "");
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>{label}</Label>
      </div>

      <p className="text-xs text-neutral-400">
        Tempelkan URL Google Maps atau embed <code>&lt;iframe&gt;</code> dari
        Google Maps.
      </p>

      <Textarea
        id={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] bg-neutral-950 border-neutral-800 text-white"
      />

      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-black"
          onClick={onReset}
          disabled={busy || !dirty}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button
          variant="destructive"
          onClick={onSave}
          disabled={busy || !dirty}
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan…
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Simpan
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* =================== main =================== */
export function DashboardOtherClient({
  initialEmail,
  initialInstagram,
  initalMapKuningan,
  initalMapPetojo,
}: {
  initialEmail: string;
  initialInstagram: string;
  initalMapKuningan: string;
  initalMapPetojo: string;
}) {
  return (
    <div className="min-h-[100dvh] bg-black text-white p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl md:text-4xl font-bold">Other</h1>
      <p className="text-neutral-400 mt-1 mb-6">
        Kelola kontak, sosial, dan peta lokasi.
      </p>

      <div className="sticky top-0 z-20 -mx-6 md:-mx-8 px-6 md:px-8 py-3 bg-black/70 backdrop-blur">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="bg-neutral-900/60 border border-neutral-800">
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="contact"
            >
              Contact
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="social"
            >
              Social
            </TabsTrigger>
            <TabsTrigger
              className="text-white data-[state=active]:text-black data-[state=active]:bg-white"
              value="maps"
            >
              Maps
            </TabsTrigger>
          </TabsList>

          {/* ===== CONTACT ===== */}
          <TabsContent value="contact" className="pt-6">
            <Section title="Email" desc="Alamat email yang tampil di website.">
              <Row icon={<Mail className="h-4 w-4" />}>
                <FieldEditor
                  name="email"
                  label="Email"
                  initialValue={initialEmail}
                  type="email"
                  placeholder="cs@domain.com"
                  validator={(v) =>
                    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
                  }
                />
              </Row>
            </Section>
          </TabsContent>

          {/* ===== SOCIAL ===== */}
          <TabsContent value="social" className="pt-6">
            <div className="grid gap-6">
              <Section
                title="Instagram"
                desc="Masukkan URL profil Instagram atau handle (@handle)."
              >
                <Row icon={<Instagram className="h-4 w-4" />}>
                  <FieldEditor
                    name="instagram"
                    label="Instagram"
                    initialValue={initialInstagram}
                    type="url"
                    placeholder="https://instagram.com/yourhandle atau @yourhandle"
                    normalize={normalizeInstagram}
                    validator={(v) => {
                      const norm = normalizeInstagram(v);
                      return !norm || isUrl(norm);
                    }}
                  />
                </Row>
                {initialInstagram ? (
                  <div className="mt-4 flex items-center gap-2 text-neutral-300 text-sm">
                    <Link2 className="h-4 w-4" />
                    <span>Link saat ini:&nbsp;</span>
                    <a
                      href={normalizeInstagram(initialInstagram)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-white"
                    >
                      {normalizeInstagram(initialInstagram)}
                    </a>
                  </div>
                ) : null}
              </Section>
            </div>
          </TabsContent>

          {/* ===== MAPS ===== */}
          <TabsContent value="maps" className="pt-6">
            <div className="grid gap-6">
              <Section
                title="Map Kuningan"
                desc="Tempelkan embed iframe Google Maps atau URL lokasi."
                right={
                  <div className="text-xs text-neutral-400 pr-1">
                    Tip: Di Google Maps &rarr; Bagikan &rarr; Sematkan peta.
                  </div>
                }
              >
                <Row icon={<MapPin className="h-4 w-4" />}>
                  <MapEditor
                    name="map_kuningan"
                    label="Embed/URL Map Kuningan"
                    initialValue={initalMapKuningan}
                    placeholder={`<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>\natau\nhttps://maps.app.goo.gl/...`}
                  />
                </Row>
              </Section>

              <Section
                title="Map Petojo"
                desc="Tempelkan embed iframe Google Maps atau URL lokasi."
              >
                <Row icon={<MapPin className="h-4 w-4" />}>
                  <MapEditor
                    name="map_petojo"
                    label="Embed/URL Map Petojo"
                    initialValue={initalMapPetojo}
                    placeholder={`<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>\natau\nhttps://maps.app.goo.gl/...`}
                  />
                </Row>
              </Section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
