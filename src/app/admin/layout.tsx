import { AuthProvider } from "@/context/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <main className="bg-black text-white">{children}</main>
    </AuthProvider>
  );
}
