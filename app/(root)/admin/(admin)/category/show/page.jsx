"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import DataTable from "@/components/application/admin/DataTable";
import DataTableWrapper from "@/components/application/admin/DataTableWrapper";
import ADMIN_ROUTES from "@/routes/admin.routes";

// Trang danh sách danh mục
export default function CategoryShowPage() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch("/api/category/delete", {
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    },
    onError: (error) => toast.error(error?.message),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["datatable"] });
      toast.success(data?.message);
    },
  });

  const columns = [
    {
      accessorKey: "name",
      header: "Tên danh mục",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "createdAt",
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString("vi-VN"),
      header: "Ngày tạo",
    },
    {
      Cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Chỉnh sửa">
            <IconButton
              component={Link}
              href={`${ADMIN_ROUTES.CATEGORY_EDIT}/${row.original._id}`}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              color="error"
              onClick={() => deleteMutation.mutate(row.original._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
      enableColumnFilter: false,
      enableSorting: false,
      header: "Hành động",
      id: "actions",
    },
  ];

  const breadcrumbData = [
    { href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
    { href: ADMIN_ROUTES.CATEGORIES, label: "Danh mục" },
  ];

  return (
    <div className="p-5">
      <AdminBreadcrumb breadcrumbData={breadcrumbData} />
      <h1 className="text-2xl font-bold mb-5">Tất cả danh mục</h1>
      <DataTableWrapper>
        <DataTable
          columns={columns}
          deleteType="SD"
          enableRowSelection={false}
          fetchUrl="/api/category"
        />
      </DataTableWrapper>
    </div>
  );
}
