import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Middleware xác thực route: kiểm tra JWT cookie và phân quyền
export async function proxy(request) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const pathname = request.nextUrl.pathname;

    // Chưa đăng nhập - redirect đến login
    if (!accessToken) {
      if (pathname.startsWith("/admin") || pathname.startsWith("/my-account")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);
    const role = payload?.role;

    // Admin: force redirect đến dashboard
    if (role === "admin") {
      if (!pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // User: không được truy cập admin
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/user") && role !== "user") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Đã đăng nhập - redirect khỏi trang login/register
    if (pathname === "/login" || pathname === "/register") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (_error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/login/:path*",
    "/register/:path*",
    "/my-account/:path*",
    "/user/:path*",
  ],
};
