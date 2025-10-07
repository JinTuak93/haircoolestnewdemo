"use client";

import type { CSSProperties } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Shield,
  UtensilsCrossed,
  FlaskConical,
  Mountain,
  Boxes,
} from "lucide-react";

type Item = { title: string; url: string; icon: React.ComponentType<any> };

const items: Item[] = [
  { title: "Sanctuary", url: "/admin/dashboard/sanctuary", icon: Shield },
  {
    title: "Ritual Menu",
    url: "/admin/dashboard/ritual-menu",
    icon: UtensilsCrossed,
  },
  { title: "Cloud Lab", url: "/admin/dashboard/cloud-lab", icon: FlaskConical },
  { title: "Cave", url: "/admin/dashboard/cave", icon: Mountain },
  { title: "Other", url: "/admin/dashboard/other", icon: Boxes },
];

// Force theme -> full black via CSS variables used by shadcn sidebar
const sidebarVars: CSSProperties = {
  // HSL values as "h s% l%" (string)
  // background / foreground
  ["--sidebar-background" as any]: "0 0% 0%", // black
  ["--sidebar-foreground" as any]: "0 0% 100%", // white
  // borders & muted
  ["--sidebar-border" as any]: "0 0% 15%",
  ["--sidebar-muted" as any]: "0 0% 12%",
  ["--sidebar-muted-foreground" as any]: "0 0% 70%",
  // primary (dipakai untuk isActive ring/hover, tetap netral)
  ["--sidebar-primary" as any]: "0 0% 100%",
  ["--sidebar-primary-foreground" as any]: "0 0% 0%",
  // accent (hover bg)
  ["--sidebar-accent" as any]: "0 0% 10%",
  ["--sidebar-accent-foreground" as any]: "0 0% 100%",
  // ring
  ["--sidebar-ring" as any]: "0 0% 100%",
};

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <Sidebar
      style={sidebarVars}
      className="!bg-black !text-white border-r border-neutral-800"
    >
      <SidebarContent className="!bg-black px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-400">
            Content Manager
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, url, icon: Icon }) => {
                const active = pathname.startsWith(url);
                return (
                  <SidebarMenuItem key={url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={[
                        "!bg-black data-[active=true]:!bg-neutral-900",
                        "data-[active=true]:text-white",
                        "data-[active=true]:border data-[active=true]:border-neutral-700",
                        "hover:!bg-neutral-900/80 hover:text-white",
                        "text-neutral-300",
                        "h-10 px-2",
                      ].join(" ")}
                    >
                      <Link
                        href={url}
                        aria-current={active ? "page" : undefined}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="!bg-black border-t border-neutral-800">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="mb-4 w-full bg-neutral-900 text-white hover:text-white/75 border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
