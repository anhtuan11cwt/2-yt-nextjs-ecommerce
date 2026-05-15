"use client";

import Link from "next/link";
import { FiBox, FiFolderPlus, FiImage, FiTag } from "react-icons/fi";

const actions = [
	{
		gradient: "from-indigo-500 to-indigo-700",
		href: "/admin/category/add",
		icon: <FiFolderPlus />,
		title: "Thêm danh mục",
	},
	{
		gradient: "from-orange-500 to-red-500",
		href: "/admin/product/add",
		icon: <FiBox />,
		title: "Thêm sản phẩm",
	},
	{
		gradient: "from-emerald-500 to-teal-600",
		href: "/admin/coupons/add",
		icon: <FiTag />,
		title: "Thêm mã giảm giá",
	},
	{
		gradient: "from-pink-500 to-rose-600",
		href: "/admin/media",
		icon: <FiImage />,
		title: "Tải lên media",
	},
];

// Các action nhanh trên dashboard
export default function QuickActions() {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-5">
			{actions.map((action) => (
				<Link
					className={`group rounded-3xl bg-gradient-to-br ${action.gradient} p-6 text-white shadow-lg transition-all duration-300 hover:scale-105`}
					href={action.href}
					key={action.href}
				>
					<div className="text-4xl opacity-90">{action.icon}</div>
					<h4 className="mt-5 font-semibold group-hover:translate-x-1 transition-all">
						{action.title}
					</h4>
				</Link>
			))}
		</div>
	);
}
