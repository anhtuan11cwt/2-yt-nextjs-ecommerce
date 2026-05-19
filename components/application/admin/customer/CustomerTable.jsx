"use client";

import Image from "next/image";
import DataTable from "@/components/application/admin/DataTable";
import DataTableWrapper from "@/components/application/admin/DataTableWrapper";

// Bảng danh sách khách hàng
export default function CustomerTable() {
  const columns = [
    {
      Cell: ({ row }) => {
        const src = row.original?.avatar?.url;
        if (!src) {
          return <span className="text-muted-foreground text-xs">—</span>;
        }
        return (
          <div className="relative h-12 w-12 overflow-hidden rounded-full border">
            <Image
              alt={row.original?.name || "avatar"}
              className="object-cover"
              fill
              sizes="48px"
              src={src}
            />
          </div>
        );
      },
      enableColumnFilter: false,
      enableSorting: false,
      header: "Avatar",
      id: "avatar",
      size: 72,
    },
    { accessorKey: "name", header: "Tên" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "phone",
      Cell: ({ row }) => <span>{row.original?.phone || "-"}</span>,
      header: "Số điện thoại",
    },
    {
      accessorKey: "isEmailVerified",
      Cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.original?.isEmailVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {row.original?.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}
        </span>
      ),
      header: "Xác thực",
    },
  ];

  return (
    <DataTableWrapper>
      <DataTable columns={columns} fetchUrl="/api/customer" />
    </DataTableWrapper>
  );
}
