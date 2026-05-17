"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logout } from "@/redux/features/authSlice";
import WEBSITE_ROUTES from "@/routes/website.routes";

// Sidebar điều hướng User Panel
export default function UserPanelNavigation() {
	const pathname = usePathname();
	const dispatch = useDispatch();
	const router = useRouter();

	// Xử lý đăng xuất
	const handleLogout = async () => {
		try {
			const response = await axios.post("/api/auth/logout");
			if (!response.data.success) {
				throw new Error(response.data.message);
			}
			dispatch(logout());
			toast.success("Đăng xuất thành công");
			router.push(WEBSITE_ROUTES.LOGIN);
		} catch (error) {
			toast.error(
				error.response?.data?.message || error.message || "Đã xảy ra lỗi gì đó",
			);
		}
	};

	// Class cơ bản cho link điều hướng
	const baseLinkClass =
		"block p-3 text-sm rounded hover:bg-primary hover:text-white";

	// Kiểm tra active link
	const getLinkClass = (path) =>
		`${baseLinkClass} ${pathname.startsWith(path) ? "bg-primary text-white" : ""}`;

	return (
		<div className="border shadow-sm p-4 rounded">
			<ul>
				<li className="mb-2">
					<Link
						className={getLinkClass("/user/dashboard")}
						href="/user/dashboard"
					>
						Tổng quan
					</Link>
				</li>

				<li className="mb-2">
					<Link className={getLinkClass("/user/profile")} href="/user/profile">
						Hồ sơ
					</Link>
				</li>

				<li className="mb-2">
					<Link className={getLinkClass("/user/orders")} href="/user/orders">
						Đơn hàng
					</Link>
				</li>

				<li className="mb-2">
					<Button
						className="w-full cursor-pointer"
						onClick={handleLogout}
						type="button"
						variant="destructive"
					>
						Đăng xuất
					</Button>
				</li>
			</ul>
		</div>
	);
}
