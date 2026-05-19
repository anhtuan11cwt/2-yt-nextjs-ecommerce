"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/application/website/footer";
import Header from "@/components/application/website/header";

const AUTH_PATHS = ["/login", "/register", "/reset-password"];
const ADMIN_PATHS = ["/admin"];

export default function WebsiteShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isAdminPage = ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-5">
        <div className="w-full max-w-md">{children}</div>
      </div>
    );
  }

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
