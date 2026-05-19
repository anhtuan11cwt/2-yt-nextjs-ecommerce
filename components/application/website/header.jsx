"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu, FiUser, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import WebsiteCart from "../../website/cart";
import Search from "../../website/search";

const Header = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [categoryLinks, setCategoryLinks] = useState([]);
  const auth = useSelector((store) => store.auth);
  const isLoggedIn = !!auth?.user;

  useEffect(() => {
    axios
      .get("/api/category/get-category")
      .then(({ data }) => {
        const links = (data.categories || []).map((cat) => ({
          href: `/shop?category=${cat.slug}`,
          name: cat.name,
        }));
        setCategoryLinks(links);
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: "/", name: "Trang chủ" },
    { href: "/shop", name: "Cửa hàng" },
    ...categoryLinks,
  ];

  return (
    <header className="w-full border-b bg-white">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-5">
        {/* LEFT — LOGO */}
        <Link href="/">
          <span className="text-2xl font-bold text-black">LOGO</span>
        </Link>

        {/* RIGHT — NAVIGATION + ACTIONS */}
        <div className="flex items-center gap-10">
          {/* NAVIGATION */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-10 px-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    className="block py-2 text-sm font-medium text-gray-600 transition hover:text-primary"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-5">
            <Search />

            <WebsiteCart />

            {/* ACCOUNT */}
            {!isLoggedIn ? (
              <Link
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
                href="/login"
              >
                <FiUser size={18} />
                <span>Đăng nhập</span>
              </Link>
            ) : (
              <Link href="/user/profile">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border">
                  {auth?.user?.avatar?.url ? (
                    <Image
                      alt="avatar"
                      className="h-full w-full object-cover"
                      height={40}
                      src={auth.user.avatar.url}
                      width={40}
                    />
                  ) : (
                    <FiUser size={18} />
                  )}
                </div>
              </Link>
            )}

            {/* HAMBURGER */}
            <button
              className="block cursor-pointer text-gray-700 lg:hidden"
              onClick={() => setIsMobileMenu(true)}
              type="button"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenu && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 cursor-pointer bg-black/50"
          onClick={() => setIsMobileMenu(false)}
          type="button"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-white shadow-xl transition-all duration-300 ${
          isMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            className="cursor-pointer"
            onClick={() => setIsMobileMenu(false)}
            type="button"
          >
            <FiX size={24} />
          </button>
        </div>
        <ul className="flex flex-col p-5">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                className="block border-b py-4 text-gray-700"
                href={link.href}
                onClick={() => setIsMobileMenu(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
