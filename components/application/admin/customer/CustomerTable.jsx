"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DataTable from "@/components/application/admin/DataTable";

// Bảng danh sách khách hàng
export default function CustomerTable() {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCustomers = async () => {
			try {
				const response = await fetch("/api/customer");
				const result = await response.json();
				if (result?.success) {
					setCustomers(result?.data || []);
				} else {
					throw new Error(result.message);
				}
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchCustomers();
	}, []);

	const columns = [
		{
			accessorKey: "avatar",
			cell: ({ row }) => (
				<Image
					alt={row.original?.name}
					className="rounded-full object-cover border"
					height={40}
					src={row.original?.avatar || "/file.svg"}
					width={40}
				/>
			),
			header: "Avatar",
		},
		{ accessorKey: "name", header: "Tên" },
		{ accessorKey: "email", header: "Email" },
		{
			accessorKey: "phone",
			cell: ({ row }) => <span>{row.original?.phone || "-"}</span>,
			header: "Số điện thoại",
		},
		{
			accessorKey: "isEmailVerified",
			cell: ({ row }) => (
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${row.original?.isEmailVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
				>
					{row.original?.isEmailVerified ? "Verified" : "Unverified"}
				</span>
			),
			header: "Xác thực",
		},
	];

	return <DataTable columns={columns} data={customers} loading={loading} />;
}
