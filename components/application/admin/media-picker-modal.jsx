"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import MediaBlock from "@/components/application/admin/media-block";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

async function fetchMediaPage(pageParam) {
	const response = await fetch(
		`/api/media?page=${pageParam}&limit=12&deleteType=active`,
		{ credentials: "include" },
	);
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result?.message || "Không tải được media");
	}
	return result;
}

export function MediaPickerModal({ open, onOpenChange, value, onChange }) {
	const [draftSelection, setDraftSelection] = useState([]);

	const handleOpenChange = (next) => {
		if (next) {
			setDraftSelection(value?.length ? [...value] : []);
		}
		onOpenChange(next);
	};

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isError,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery({
		enabled: open,
		getNextPageParam: (lastPage, allPages) =>
			lastPage?.hasMore ? allPages.length + 1 : undefined,
		initialPageParam: 1,
		queryFn: ({ pageParam }) => fetchMediaPage(pageParam),
		queryKey: ["media-picker-modal", open],
	});

	const mediaList = data?.pages.flatMap((page) => page?.mediaData || []) || [];

	const handleConfirm = () => {
		const unique = [];
		const seen = new Set();
		for (const item of draftSelection) {
			if (!seen.has(item._id)) {
				seen.add(item._id);
				unique.push(item);
			}
		}
		onChange(unique);
		handleOpenChange(false);
	};

	return (
		<Sheet onOpenChange={handleOpenChange} open={open}>
			<SheetContent className="w-full overflow-y-auto sm:max-w-lg md:max-w-2xl">
				<SheetHeader>
					<SheetTitle>Chọn hình ảnh</SheetTitle>
				</SheetHeader>

				{isLoading ? (
					<div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3">
						{[...Array(6)].map((_, i) => (
							<div
								className={cn(
									"aspect-square animate-pulse rounded-lg bg-muted",
								)}
								// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
								key={i}
							/>
						))}
					</div>
				) : null}

				{isError ? (
					<p className="text-destructive py-4 text-sm">
						{error?.message ||
							"Không tải được thư viện media. Đăng nhập admin và thử lại."}
					</p>
				) : null}

				{!isLoading && !isError ? (
					<div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3">
						{mediaList.map((media) => (
							<MediaBlock
								isMultiple
								key={media._id}
								media={media}
								selectedMedia={draftSelection}
								setSelectedMedia={setDraftSelection}
							/>
						))}
					</div>
				) : null}

				{hasNextPage ? (
					<Button
						className="w-full"
						disabled={isFetchingNextPage}
						onClick={() => fetchNextPage()}
						type="button"
						variant="outline"
					>
						{isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
					</Button>
				) : null}

				{draftSelection.length > 0 ? (
					<div className="flex flex-wrap gap-2 border-t pt-4">
						{draftSelection.map((item) => (
							<div
								className="relative h-14 w-14 overflow-hidden rounded-md border"
								key={item._id}
							>
								{item.url ? (
									<Image
										alt=""
										className="object-cover"
										fill
										sizes="56px"
										src={item.url}
									/>
								) : null}
							</div>
						))}
					</div>
				) : null}

				<SheetFooter className="flex-row justify-end gap-2 pt-4">
					<Button
						onClick={() => handleOpenChange(false)}
						type="button"
						variant="outline"
					>
						Hủy
					</Button>
					<Button onClick={handleConfirm} type="button">
						Xác nhận ({draftSelection.length})
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
