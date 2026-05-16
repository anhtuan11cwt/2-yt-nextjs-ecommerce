"use client";

import { FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";

// Trang Tổng quan của User
export default function UserDashboardPage() {
	const breadcrumbLinks = [{ label: "Tổng quan" }];

	return (
		<>
			<WebsiteBreadcrumb links={breadcrumbLinks} />

			<div className="shadow rounded p-5">
				<h2 className="text-xl font-semibold border-b pb-3 mb-5">Tổng quan</h2>

				{/* Grid thống kê */}
				<div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
					{/* Tổng đơn hàng */}
					<div className="flex justify-between items-center border rounded p-5">
						<div>
							<h4 className="font-semibold mb-1">Tổng đơn hàng</h4>
							<span className="text-gray-500 font-semibold">0</span>
						</div>
						<div className="w-16 h-16 rounded-full bg-primary flex justify-center items-center">
							<FiShoppingBag className="text-white text-[25px]" />
						</div>
					</div>

					{/* Sản phẩm trong giỏ */}
					<div className="flex justify-between items-center border rounded p-5">
						<div>
							<h4 className="font-semibold mb-1">Sản phẩm trong giỏ</h4>
							<span className="text-gray-500 font-semibold">0</span>
						</div>
						<div className="w-16 h-16 rounded-full bg-primary flex justify-center items-center">
							<FiShoppingCart className="text-white text-[25px]" />
						</div>
					</div>
				</div>

				{/* Bảng đơn hàng gần đây */}
				<div className="mt-5">
					<h4 className="text-lg font-semibold mb-3">Đơn hàng gần đây</h4>

					<table className="w-full">
						<thead>
							<tr>
								<th className="p-3 border-b text-gray-500">STT</th>
								<th className="p-3 border-b text-gray-500">Mã đơn hàng</th>
								<th className="p-3 border-b text-gray-500">Số lượng</th>
								<th className="p-3 border-b text-gray-500">Tổng tiền</th>
							</tr>
						</thead>
						<tbody>{/* Dữ liệu API sẽ render ở đây */}</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
