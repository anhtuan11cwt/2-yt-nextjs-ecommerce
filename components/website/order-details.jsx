"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";

const statusStyles = {
	Cancelled: "bg-red-50 text-red-700 border-red-200",
	Delivered: "bg-green-50 text-green-700 border-green-200",
	Pending: "bg-amber-50 text-amber-700 border-amber-200",
	Processing: "bg-blue-50 text-blue-700 border-blue-200",
	Shipped: "bg-purple-50 text-purple-700 border-purple-200",
};

const statusLabels = {
	Cancelled: "Đã hủy",
	Delivered: "Đã giao",
	Pending: "Chờ xử lý",
	Processing: "Đang xử lý",
	Shipped: "Đã gửi hàng",
};

const paymentStyles = {
	Failed: "bg-red-50 text-red-700 border-red-200",
	Paid: "bg-green-50 text-green-700 border-green-200",
	Pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const paymentLabels = {
	Failed: "Thất bại",
	Paid: "Đã thanh toán",
	Pending: "Chờ thanh toán",
};

const formatCurrency = (amount) =>
	(amount || 0).toLocaleString("vi-VN", {
		currency: "VND",
		style: "currency",
	});

const OrderDetails = ({ orderId }) => {
	const [loading, setLoading] = useState(true);
	const [order, setOrder] = useState(null);
	const printRef = useRef(null);

	const handlePrint = () => {
		const printContent = printRef.current?.innerHTML;
		if (!printContent) return;

		const printWindow = window.open("", "_blank");
		printWindow.document.write(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>In hóa đơn</title>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body class="p-8">
				${printContent}
				<script>
					window.print();
					window.onafterprint = () => window.close();
				</script>
			</body>
			</html>
		`);
		printWindow.document.close();
	};

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				setLoading(true);
				const { data } = await axios.get(`/api/order/get/${orderId}`);
				if (data?.success) {
					setOrder(data.order);
				}
			} catch (error) {
				console.error("Lỗi tải chi tiết đơn hàng:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOrder();
	}, [orderId]);

	if (loading) {
		return (
			<div className="py-20 text-center text-lg font-medium">
				Đang tải thông tin đơn hàng...
			</div>
		);
	}

	if (!order) {
		return (
			<div className="py-20 text-center">
				<p className="text-red-500 text-lg font-medium">
					Không tìm thấy đơn hàng
				</p>
				<Link
					className="mt-4 inline-block text-indigo-600 hover:underline"
					href="/shop"
				>
					Quay lại cửa hàng
				</Link>
			</div>
		);
	}

	const subTotal = order.products.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<div className="bg-gray-50 min-h-screen">
			<WebsiteBreadcrumb
				links={[
					{ href: "/website", label: "Trang chủ" },
					{ label: "Chi tiết đơn hàng" },
				]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
					<div ref={printRef}>
						{/* ORDER INFO */}
						<div className="grid grid-cols-1 gap-4 border-b border-gray-100 pb-6 md:grid-cols-3">
							<div>
								<p className="text-sm font-medium text-gray-500">Mã đơn hàng</p>
								<p className="mt-1 select-all text-base font-semibold text-gray-900">
									{order._id}
								</p>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-500">
									Mã giao dịch (Payment ID)
								</p>
								<p className="mt-1 text-base font-semibold text-gray-700">
									{order.stripePaymentIntentId || "N/A"}
								</p>
							</div>

							<div className="flex flex-wrap items-start gap-3">
								<div>
									<p className="text-sm font-medium text-gray-500">
										Trạng thái đơn hàng
									</p>
									<span
										className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.orderStatus] || statusStyles.Pending}`}
									>
										{statusLabels[order.orderStatus] || order.orderStatus}
									</span>
								</div>

								<div>
									<p className="text-sm font-medium text-gray-500">
										Thanh toán
									</p>
									<span
										className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${paymentStyles[order.paymentStatus] || paymentStyles.Pending}`}
									>
										{paymentLabels[order.paymentStatus] || order.paymentStatus}
									</span>
								</div>
							</div>
						</div>

						{/* PRODUCTS TABLE */}
						<div>
							<h3 className="mb-4 text-lg font-bold text-gray-900">
								Sản phẩm đã mua
							</h3>
							<div className="overflow-x-auto rounded-xl border border-gray-100">
								<table className="w-full text-left text-sm text-gray-500">
									<thead className="hidden border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-700 md:table-header-group">
										<tr>
											<th className="px-6 py-4" scope="col">
												Sản phẩm
											</th>
											<th className="px-6 py-4 text-center" scope="col">
												Giá đơn vị
											</th>
											<th className="px-6 py-4 text-center" scope="col">
												Số lượng
											</th>
											<th className="px-6 py-4 text-right" scope="col">
												Tổng cộng
											</th>
										</tr>
									</thead>

									<tbody className="block divide-y divide-gray-100 md:table-row-group">
										{order.products.map((item) => {
											const variantMedia = item.variant?.media?.[0];
											const thumbImg =
												item.image ||
												variantMedia?.path ||
												variantMedia?.thumbnailUrl ||
												"/placeholder.jpg";

											return (
												<tr
													className="block border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50/50 md:table-row md:border-b-0"
													key={item._id || item.variant?._id}
												>
													<td className="block px-6 py-4 md:table-cell">
														<div className="flex items-center space-x-4">
															<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100">
																<Image
																	alt={item.name || "Product"}
																	className="object-cover"
																	fill
																	src={thumbImg}
																/>
															</div>
															<div className="min-w-0 flex-1">
																<Link
																	className="block truncate text-sm font-semibold text-gray-900 transition-colors hover:text-indigo-600"
																	href={`/product/${item.product?.slug || ""}`}
																>
																	{item.product?.name || item.name}
																</Link>
																{(item.color || item.size) && (
																	<p className="mt-0.5 text-xs capitalize text-gray-500">
																		{item.color && `Màu: ${item.color}`}
																		{item.color && item.size && " / "}
																		{item.size && `Size: ${item.size}`}
																	</p>
																)}
															</div>
														</div>
													</td>

													<td className="flex items-center justify-between px-6 py-3 text-right font-medium text-gray-700 before:content-['Giá_đơn_vị:'] md:table-cell md:py-4 md:text-center md:before:content-none">
														<span>{formatCurrency(item.price)}</span>
													</td>

													<td className="flex items-center justify-between px-6 py-3 text-right font-medium text-gray-900 before:content-['Số_lượng:'] md:table-cell md:py-4 md:text-center md:before:content-none">
														<span>{item.quantity}</span>
													</td>

													<td className="flex items-center justify-between px-6 py-3 text-right font-bold text-indigo-600 before:content-['Tổng:'] md:table-cell md:py-4 md:before:content-none">
														<span>
															{formatCurrency(item.price * item.quantity)}
														</span>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>

						{/* SHIPPING ADDRESS & ORDER SUMMARY */}
						<div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-2">
							{/* SHIPPING ADDRESS */}
							<div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-5 md:p-6">
								<h4 className="mb-4 flex items-center gap-2 border-b border-gray-200/60 pb-2 text-base font-bold text-gray-900">
									Địa chỉ giao hàng
								</h4>

								<div className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm text-gray-600 sm:grid-cols-2">
									<div>
										<span className="font-medium text-gray-500">
											Họ và tên:
										</span>{" "}
										{order.shippingAddress?.name || "—"}
									</div>
									<div>
										<span className="font-medium text-gray-500">Email:</span>{" "}
										{order.shippingAddress?.email || "—"}
									</div>
									<div>
										<span className="font-medium text-gray-500">
											Điện thoại:
										</span>{" "}
										{order.shippingAddress?.phone || "—"}
									</div>
									<div>
										<span className="font-medium text-gray-500">
											Tỉnh/Bang:
										</span>{" "}
										{order.shippingAddress?.state || "—"}
									</div>
									<div>
										<span className="font-medium text-gray-500">
											Thành phố:
										</span>{" "}
										{order.shippingAddress?.city || "—"}
									</div>
									<div>
										<span className="font-medium text-gray-500">
											Mã bưu điện:
										</span>{" "}
										{order.shippingAddress?.pincode || "—"}
									</div>
									<div>
										<span className="font-medium text-gray-500">Địa danh:</span>{" "}
										{order.shippingAddress?.landmark || "Trống"}
									</div>
								</div>

								{order.orderNote && (
									<div className="mt-2 rounded-lg border border-gray-100 bg-white p-3 sm:col-span-2">
										<span className="mb-1 block font-medium text-gray-500">
											Ghi chú đơn hàng:
										</span>
										<span className="italic text-gray-700">
											{order.orderNote}
										</span>
									</div>
								)}
							</div>

							{/* ORDER SUMMARY */}
							<div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-5 md:p-6">
								<div>
									<h4 className="mb-4 border-b border-gray-200/60 pb-2 text-base font-bold text-gray-900">
										Tóm tắt hóa đơn
									</h4>

									<div className="space-y-3 text-sm">
										<div className="flex items-center justify-between text-gray-600">
											<span>Tạm tính</span>
											<span className="font-medium">
												{formatCurrency(subTotal)}
											</span>
										</div>

										{order.couponDiscount > 0 && (
											<div className="flex items-center justify-between text-green-600">
												<span>
													Giảm giá
													{order.couponCode && ` (${order.couponCode})`}
												</span>
												<span className="font-medium">
													-{formatCurrency(order.couponDiscount)}
												</span>
											</div>
										)}

										<div className="flex items-center justify-between border-b border-gray-200/60 pb-3 text-green-600">
											<span>Chiết khấu sản phẩm</span>
											<span className="font-medium">
												-{formatCurrency(subTotal - order.totalAmount)}
											</span>
										</div>
									</div>
								</div>

								<div className="mt-4 flex items-center justify-between pt-4 lg:mt-0">
									<span className="text-base font-bold text-gray-900">
										Tổng tiền thanh toán
									</span>
									<span className="text-2xl font-black text-indigo-600">
										{formatCurrency(order.totalAmount)}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* ACTIONS */}
					<div className="flex flex-col justify-end gap-3 border-t border-gray-100 pt-4 sm:flex-row">
						<button
							className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95"
							onClick={handlePrint}
							type="button"
						>
							In hóa đơn
						</button>
						<Link
							className="rounded-xl bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
							href="/shop"
						>
							Tiếp tục mua sắm
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
