import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith("/medico") &&
      req.nextauth.token?.role !== "practitioner"
    ) {
      return NextResponse.rewrite(
        new URL(
          "/login?message=No tienes permisos para acceder a esta página",
          req.url
        )
      );
    }
    if (
      req.nextUrl.pathname.startsWith("/administrator") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(
        new URL(
          "/login?message=No tienes permisos para acceder a esta página",
          req.url
        )
      );
    }
    if (
      req.nextUrl.pathname.startsWith("/secretaria") &&
      req.nextauth.token?.role !== "secretary"
    ) {
      return NextResponse.rewrite(
        new URL(
          "/login?message=No tienes permisos para acceder a esta página",
          req.url
        )
      );
    }
    if (
      req.nextUrl.pathname.startsWith("/paciente") &&
      req.nextauth.token?.role !== "patient"
    ) {
      return NextResponse.rewrite(
        new URL(
          "/login?message=No tienes permisos para acceder a esta página",
          req.url
        )
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
    matcher:["/medico/:path*","/secretaria/:path*","/administrator/:path*", "/paciente/:path*"],
};