"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import MediaBlock from "@/components/application/admin/media-block";
import UploadMedia from "@/components/application/admin/upload-media";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchMedia } from "@/lib/api/fetchMedia";

const MediaPage = () => {
	const [deleteType, _setDeleteType] = useState("active");
	const [selectedMedia, setSelectedMedia] = useState([]);

	const {
		data,
		error,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasMore ? allPages.length + 1 : undefined,
		initialPageParam: 1,
		queryFn: ({ pageParam }) => fetchMedia({ deleteType, pageParam }),
		queryKey: ["media", deleteType],
	});

	const mediaData = data?.pages.flatMap((page) => page.mediaData) || [];
	const selectAll =
		mediaData.length > 0 && selectedMedia.length === mediaData.length;

	const handleSelectAll = (checked) => {
		if (checked) {
			setSelectedMedia(
				mediaData.map((item) => ({ _id: item._id, url: item.secureUrl })),
			);
		} else {
			setSelectedMedia([]);
		}
	};

	const breadcrumbData = [
		{ href: "/admin/dashboard", label: "Bảng điều khiển" },
		{ href: "/admin/media", label: "Hình ảnh" },
	];

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<AdminBreadcrumb breadcrumbData={breadcrumbData} />
				<UploadMedia />
			</div>

			{selectedMedia.length > 0 && (
				<div className="mb-5 flex items-center justify-between rounded-xl border bg-background p-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
							<span className="text-sm font-medium">Chọn tất cả</span>
						</div>
						<p className="text-sm font-medium">
							{selectedMedia.length} đã chọn
						</p>
					</div>
					<div className="flex items-center gap-2">
						{deleteType === "trash" ? (
							<>
								<Button variant="outline">Khôi phục</Button>
								<Button variant="destructive">Xóa Vĩnh viễn</Button>
							</>
						) : (
							<Button variant="destructive">Chuyển vào Thùng rác</Button>
						)}
					</div>
				</div>
			)}

			{isLoading ? (
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{[...Array(10)].map((_, i) => (
						<div
							className="aspect-square rounded-xl bg-muted animate-pulse"
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
							key={i}
						/>
					))}
				</div>
			) : error ? (
				<div className="text-red-500">Tải media thất bại</div>
			) : mediaData.length === 0 ? (
				<div className="text-muted-foreground text-center py-20">
					Không tìm thấy media
				</div>
			) : (
				<>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{mediaData.map((media) => (
							<MediaBlock
								key={media._id}
								media={media}
								selectedMedia={selectedMedia}
								setSelectedMedia={setSelectedMedia}
							/>
						))}
					</div>
					{hasNextPage && (
						<div className="flex justify-center mt-8">
							<Button
								disabled={isFetchingNextPage}
								onClick={() => fetchNextPage()}
							>
								{isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default MediaPage;
