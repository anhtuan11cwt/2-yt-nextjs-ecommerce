import {
	Boxes,
	FolderKanban,
	Image,
	LayoutDashboard,
	List,
	Package,
	Plus,
	ShoppingCart,
	Star,
	TicketPercent,
	Users,
} from "lucide-react";

import ADMIN_ROUTES from "@/routes/admin.routes";

export const adminSidebarMenu = [
	{
		icon: LayoutDashboard,
		title: "Bảng điều khiển",
		url: "/admin/dashboard",
	},
	{
		icon: FolderKanban,
		subMenu: [
			{
				icon: Plus,
				title: "Thêm danh mục",
				url: ADMIN_ROUTES.ADD_CATEGORY,
			},
			{
				icon: List,
				title: "Tất cả danh mục",
				url: ADMIN_ROUTES.CATEGORIES,
			},
		],
		title: "Danh mục",
	},
	{
		icon: Package,
		subMenu: [
			{
				icon: Plus,
				title: "Thêm sản phẩm",
				url: ADMIN_ROUTES.PRODUCT_ADD,
			},
			{
				icon: List,
				title: "Tất cả sản phẩm",
				url: ADMIN_ROUTES.PRODUCT_SHOW,
			},
		],
		title: "Sản phẩm",
	},
	{
		icon: Boxes,
		subMenu: [
			{
				icon: Plus,
				title: "Thêm biến thể",
				url: ADMIN_ROUTES.VARIANT_ADD,
			},
			{
				icon: List,
				title: "Tất cả biến thể",
				url: ADMIN_ROUTES.VARIANT_SHOW,
			},
		],
		title: "Biến thể",
	},
	{
		icon: TicketPercent,
		subMenu: [
			{
				icon: Plus,
				title: "Thêm mã giảm giá",
				url: "/admin/coupons/create",
			},
			{
				icon: List,
				title: "Tất cả mã giảm giá",
				url: "/admin/coupons",
			},
		],
		title: "Mã giảm giá",
	},
	{
		icon: ShoppingCart,
		title: "Đơn hàng",
		url: "/admin/orders",
	},
	{
		icon: Users,
		title: "Khách hàng",
		url: "/admin/customers",
	},
	{
		icon: Star,
		title: "Đánh giá",
		url: "/admin/reviews",
	},
	{
		icon: Image,
		title: "Hình ảnh",
		url: "/admin/media",
	},
];
