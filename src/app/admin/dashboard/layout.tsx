import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import ProtectedRoute from "@/components/admin/protected-route";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 min-h-screen w-full overflow-x-hidden">
            <div className="p-4 md:p-6">
              <SidebarTrigger className="mb-4" />
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
