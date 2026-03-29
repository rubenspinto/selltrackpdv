import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Instância isolada do NextAuth para uso exclusivo no Middleware (Edge Runtime).
 * Usa apenas o authConfig (sem Prisma ou Argon2) para ser compatível com o Edge.
 * A autenticação real (verify de senha, etc.) continua acontecendo em auth.ts.
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Rotas públicas (se precisar usar no futuro)
  // const isPublicRoute = ["/", "/login", "/cadastro"].includes(pathname);

  // Rotas protegidas
  const isProtectedRoute =
    pathname.startsWith("/pdv") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/produtos");

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

// Configuração para o middleware ser executado em todas as rotas, exceto as estáticas
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
