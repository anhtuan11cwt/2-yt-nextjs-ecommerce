"use client";

import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ADMIN_ROUTES from "@/routes/admin.routes";

// Cấu hình cột bảng mã giảm giá
export const getColumns = (onDelete) => [
	{
		accessorKey: "code",
		header: "Mã giảm giá",
	},
	{
		accessorKey: "discountPercent",
		cell: ({ row }) => <span>{row.original.discountPercent}%</span>,
		header: "Giảm (%)",
	},
	{
		accessorKey: "minimumShoppingAmount",
		header: "Đơn tối thiểu",
	},
	{
		accessorKey: "validity",
		cell: ({ row }) => {
			const validity = new Date(row.original.validity);
			return <span>{format(validity, "dd/MM/yyyy HH:mm")}</span>;
		},
		header: "Hạn dùng",
	},
	{
		accessorKey: "status",
		cell: ({ row }) => {
			const validity = new Date(row.original.validity);
			const isExpired = validity < new Date();
			return (
				<span
					className={`px-3 py-1 rounded-full text-xs font-medium ${
						isExpired
							? "bg-red-100 text-red-600"
							: "bg-green-100 text-green-600"
					}`}
				>
					{isExpired ? "Expired" : "Active"}
				</span>
			);
		},
		header: "Trạng thái",
	},
	{
		cell: ({ row }) => {
			const coupon = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="h-8 w-8 p-0" variant="ghost">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem asChild>
							<Link href={ADMIN_ROUTES.ADMIN_COUPON_EDIT(coupon._id)}>
								<Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-red-600"
							onClick={() => onDelete(coupon._id)}
						>
							<Trash className="mr-2 h-4 w-4" /> Xóa
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		id: "actions",
	},
];
