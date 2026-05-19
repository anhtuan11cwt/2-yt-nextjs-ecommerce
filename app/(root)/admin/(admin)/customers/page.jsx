"use client";

import CustomerTable from "@/components/application/admin/customer/CustomerTable";

// Trang quản lý khách hàng
export default function CustomerShowPage() {
  return (
    <div className="p-5">
      <div className="bg-white rounded-xl border p-5">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Khách hàng</h1>
          <p className="text-sm text-gray-500">Quản lý danh sách khách hàng</p>
        </div>
        <CustomerTable />
      </div>
    </div>
  );
}
