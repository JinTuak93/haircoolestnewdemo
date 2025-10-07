import { NextRequest, NextResponse } from "next/server";

// middleware
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin")
    return NextResponse.redirect(
      new URL("/admin/dashboard/sanctuary", req.url)
    );
  if (pathname === "/admin/dashboard")
    return NextResponse.redirect(
      new URL("/admin/dashboard/sanctuary", req.url)
    );
}

// config
export const config = {};
