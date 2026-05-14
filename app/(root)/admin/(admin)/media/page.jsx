"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import MediaBlock from "@/components/application/admin/media-block";
import UploadMedia from "@/components/application/admin/upload-media";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { fetchMedia } from "@/lib/api/fetchMedia";

const MediaPage = () => {
	const [mediaTab, setMediaTab] = useState("active");
	const [selectedMedia, setSelectedMedia] = useState([]);

	const listDeleteType = mediaTab === "deleted" ? "deleted" : "active";

	const deleteMutation = useDeleteMutation({
		deleteEndpoint: "/api/media/delete",
		onSuccess: () => setSelectedMedia([]),
		queryKey: ["media"],
	});

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
		queryFn: ({ pageParam }) =>
			fetchMedia({ deleteType: listDeleteType, pageParam }),
		queryKey: ["media", mediaTab],
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
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
				<AdminBreadcrumb breadcrumbData={breadcrumbData} />
				<div className="flex flex-wrap items-center gap-3">
					<div className="flex rounded-lg border bg-muted/40 p-1">
						<Button
							className="rounded-md shadow-none"
							onClick={() => {
								setMediaTab("active");
								setSelectedMedia([]);
							}}
							size="sm"
							variant={mediaTab === "active" ? "secondary" : "ghost"}
						>
							Thư viện
						</Button>
						<Button
							className="rounded-md shadow-none"
							onClick={() => {
								setMediaTab("deleted");
								setSelectedMedia([]);
							}}
							size="sm"
							variant={mediaTab === "deleted" ? "secondary" : "ghost"}
						>
							Thùng rác
						</Button>
					</div>
					<UploadMedia />
				</div>
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
						{mediaTab === "deleted" ? (
							<>
								<Button
									disabled={deleteMutation.isPending}
									onClick={() =>
										deleteMutation.mutate({
											deleteType: "RSD",
											ids: selectedMedia.map((item) => item._id),
										})
									}
									variant="outline"
								>
									Khôi phục
								</Button>
								<Button
									disabled={deleteMutation.isPending}
									onClick={() =>
										deleteMutation.mutate({
											deleteType: "PD",
											ids: selectedMedia.map((item) => item._id),
										})
									}
									variant="destructive"
								>
									Xóa Vĩnh viễn
								</Button>
							</>
						) : (
							<Button
								disabled={deleteMutation.isPending}
								onClick={() =>
									deleteMutation.mutate({
										deleteType: "SD",
										ids: selectedMedia.map((item) => item._id),
									})
								}
								variant="destructive"
							>
								Chuyển vào Thùng rác
							</Button>
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
					{mediaTab === "deleted" ? "Thùng rác trống" : "Không tìm thấy media"}
				</div>
			) : (
				<>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{mediaData.map((media) => (
							<MediaBlock
								isTrash={mediaTab === "deleted"}
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
