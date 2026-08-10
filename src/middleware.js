import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Handle dashboard redirection based on role if they try to access /dashboard directly
    if (path === "/dashboard") {
      if (token?.role === "CLIENT") {
        return NextResponse.redirect(new URL("/dashboard/client", req.url));
      } else if (token?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard/freelancer", req.url));
      }
    }

    // Protect specific routes (e.g. client cannot access freelancer dashboard)
    if (path.startsWith("/dashboard/client") && token?.role !== "CLIENT" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (path.startsWith("/dashboard/freelancer") && token?.role !== "FREELANCER" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
