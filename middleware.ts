import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET })
  const isAuthenticated = !!token

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password"]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Check if the request is for the root path
  const isRootPath = request.nextUrl.pathname === "/"

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute && !isRootPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access a public route
  if (isAuthenticated && (isPublicRoute || isRootPath)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

