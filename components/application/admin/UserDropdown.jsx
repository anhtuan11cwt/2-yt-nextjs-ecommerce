"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./LogoutButton";

// Dropdown thông tin người dùng
const UserDropdown = () => {
  const { auth } = useSelector((state) => state.auth);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
            flex
            items-center
            gap-2
            rounded-full
            outline-none
          "
          type="button"
        >
          <Avatar>
            <AvatarImage src={auth?.avatar?.url} />

            <AvatarFallback>{auth?.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="hidden md:block text-left">
            <h4 className="text-sm font-medium leading-none">{auth?.name}</h4>

            <p className="text-xs text-muted-foreground">{auth?.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/admin/product/add">Thêm sản phẩm</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/admin/orders">Đơn hàng</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
