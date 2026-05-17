"use client";

import Image from "next/image";
import useSWR from "swr";

const fetcher = async (url) => {
	const res = await fetch(url);
	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Lỗi khi tải dữ liệu");
	}
	return json;
};

// Component hiển thị số sao
const StarRating = ({ rating }) => {
	const stars = Math.round(rating || 5);
	return <span className="inline-flex gap-0.5">{"★".repeat(stars)}</span>;
};

// Danh sách 6 đánh giá mới nhất
export default function LatestReviewsList() {
	const { data, isLoading, error } = useSWR(
		"/api/admin/dashboard/latest-reviews",
		fetcher,
	);
	const reviews = data?.data || [];

	if (isLoading) {
		return (
			<div className="flex h-[400px] items-center justify-center rounded-xl border border-gray-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-[400px] items-center justify-center rounded-xl border border-gray-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
				<p className="text-sm text-red-500">Lỗi: {error.message}</p>
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
			<h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
				Đánh giá mới nhất
			</h3>
			<div className="space-y-4">
				{reviews.length === 0 ? (
					<p className="py-10 text-center text-sm text-gray-400">
						Chưa có đánh giá nào
					</p>
				) : (
					reviews.map((review) => {
						const thumbnail = review.thumbnail || "/placeholder.jpg";

						return (
							<div
								className="flex gap-4 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
								key={review._id}
							>
								<div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
									<Image
										alt={review.productId?.name || "Product"}
										className="object-cover"
										fill
										src={thumbnail}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<div className="mb-1 flex items-center justify-between gap-2">
										<h4 className="truncate text-sm font-medium text-slate-800 dark:text-white">
											{review.productId?.name || "Sản phẩm không xác định"}
										</h4>
										<div className="flex flex-shrink-0 gap-0.5 text-amber-400">
											<StarRating rating={review.rating} />
										</div>
									</div>
									{review.userId?.name && (
										<p className="mb-0.5 text-xs text-gray-400">
											{review.userId.name}
										</p>
									)}
									<p className="line-clamp-2 text-xs italic text-gray-500 dark:text-gray-400">
										&ldquo;{review.review || "Không có nội dung"}&rdquo;
									</p>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
