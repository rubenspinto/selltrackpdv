import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/cadastro"];

// Define routes that only authenticated users can access
const protectedRoutes = ["/pdv"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is an API route for authentication
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Get session from cookie
  const sessionCookie = request.cookies.get("session");
  const session = sessionCookie
    ? await verifySession(sessionCookie.value)
    : null;

  // Check if user is trying to access a protected route without authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    // Redirect to login if trying to access protected route without session
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check if authenticated user is trying to access login page
  if (pathname === "/login" && session) {
    // Redirect to PDV if already authenticated
    const pdvUrl = new URL("/pdv", request.url);
    return NextResponse.redirect(pdvUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
