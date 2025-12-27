import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth.config";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Rotas públicas
  const isPublicRoute = ["/", "/login", "/cadastro"].includes(pathname);

  // Rotas protegidas
  const isProtectedRoute =
    pathname.startsWith("/pdv") || pathname.startsWith("/dashboard");

  // Usuário logado tentando acessar login/cadastro → /pdv
  if (isLoggedIn && (pathname === "/login" || pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/pdv", req.url));
  }

  // Usuário não logado tentando acessar rota protegida → /login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
