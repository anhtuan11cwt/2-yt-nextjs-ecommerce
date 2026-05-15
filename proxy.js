import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function proxy(request) {
	try {
		const accessToken = request.cookies.get("access_token")?.value;
		const pathname = request.nextUrl.pathname;

		if (!accessToken) {
			if (pathname.startsWith("/admin") || pathname.startsWith("/my-account")) {
				return NextResponse.redirect(new URL("/login", request.url));
			}
			return NextResponse.next();
		}

		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(accessToken, secret);
		const role = payload?.role;

		if (pathname.startsWith("/admin") && role !== "admin") {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		if (pathname.startsWith("/my-account") && role !== "user") {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		if (pathname === "/login" || pathname === "/register") {
			if (role === "admin" && pathname !== "/admin/dashboard") {
				return NextResponse.redirect(new URL("/admin/dashboard", request.url));
			}
			if (role === "user" && pathname !== "/") {
				return NextResponse.redirect(new URL("/", request.url));
			}
		}

		return NextResponse.next();
	} catch (_error) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: [
		"/admin/:path*",
		"/login/:path*",
		"/register/:path*",
		"/my-account/:path*",
	],
};
