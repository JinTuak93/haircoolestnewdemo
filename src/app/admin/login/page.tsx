/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/** ---------- Wrapper: WAJIB untuk Suspense ---------- */
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-6 w-6 animate-spin mb-3" />
            <span className="text-sm text-neutral-300">Memuat…</span>
          </div>
        </div>
      }
    >
      <DashboardLoginInner />
    </Suspense>
  );
}

/** ---------- Isi Halaman: memakai useSearchParams di dalam Suspense ---------- */
function DashboardLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = useMemo(
    () => searchParams.get("redirect") || "/admin/dashboard/sanctuary",
    [searchParams]
  );

  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push(redirect);
  }, [user, router, redirect]);

  const mapFirebaseError = (code?: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/user-disabled":
        return "Akun dinonaktifkan. Hubungi admin.";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email atau password salah.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan. Coba lagi nanti.";
      default:
        return "Terjadi kesalahan. Coba lagi.";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailTrim = email.trim();
    const pwTrim = password;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setError("Gunakan email yang valid.");
      setLoading(false);
      return;
    }
    if (pwTrim.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, emailTrim, pwTrim);
      router.push(redirect);
    } catch (err: any) {
      const msg = mapFirebaseError(err?.code);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-black text-white border border-neutral-800 shadow-none">
        <CardHeader>
          <CardTitle className="text-white">Admin Login</CardTitle>
          <CardDescription className="text-neutral-300">
            Masukkan kredensial untuk mengakses dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} noValidate>
            {error && (
              <p
                role="alert"
                aria-live="polite"
                className="mb-3 text-sm text-red-500"
              >
                {error}
              </p>
            )}

            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-neutral-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-600"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-neutral-200">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                    aria-label={
                      showPw ? "Sembunyikan password" : "Tampilkan password"
                    }
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(Boolean(v))}
                    className="border-neutral-700 data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-white"
                  />
                  <span className="text-sm text-neutral-200">Ingat saya</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses…
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
