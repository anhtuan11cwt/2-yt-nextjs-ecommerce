"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import CouponForm from "@/components/application/admin/coupon-form";
import ADMIN_ROUTES from "@/routes/admin.routes";

export default function AddCouponPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e, formData) => {
		e.preventDefault();
		try {
			setLoading(true);

			const response = await fetch("/api/coupon/create", {
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}

			toast.success("Tạo mã giảm giá thành công");
			router.push(ADMIN_ROUTES.ADMIN_COUPON_SHOW);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const breadcrumbData = [
		{ href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
		{ href: ADMIN_ROUTES.ADMIN_COUPON_SHOW, label: "Mã giảm giá" },
		{ href: ADMIN_ROUTES.ADMIN_COUPON_ADD, label: "Thêm mã giảm giá" },
	];

	return (
		<div className="p-5">
			<AdminBreadcrumb breadcrumbData={breadcrumbData} />
			<h1 className="text-2xl font-bold mb-5">Thêm mã giảm giá</h1>
			<div className="max-w-3xl">
				<CouponForm loading={loading} onSubmit={handleSubmit} />
			</div>
		</div>
	);
}
