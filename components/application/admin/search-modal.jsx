"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchData } from "@/lib/search";

export default function SearchModal({ open, setOpen }) {
	const [query, setQuery] = useState("");
	const fuse = useMemo(
		() =>
			new Fuse(searchData, {
				keys: ["label", "description", "keywords"],
				threshold: 0.3,
			}),
		[],
	);

	const results = useMemo(() => {
		if (!query) return [];
		return fuse.search(query);
	}, [query, fuse]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="max-w-2xl p-0 overflow-hidden">
				<VisuallyHidden>
					<DialogTitle>Tìm kiếm</DialogTitle>
					<DialogDescription>Tìm kiếm trang quản trị</DialogDescription>
				</VisuallyHidden>
				<div className="border-b p-4">
					<Input
						autoFocus
						className="border-0 shadow-none focus-visible:ring-0 text-base"
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Tìm đường dẫn..."
						value={query}
					/>
				</div>
				<div className="max-h-[400px] overflow-y-auto">
					{results.length > 0 ? (
						<div className="p-2">
							{results.map((result) => (
								<Link
									className="block rounded-lg p-3 hover:bg-muted transition-all"
									href={result.item.url}
									key={result.item.url}
									onClick={() => setOpen(false)}
								>
									<h4 className="font-medium">{result.item.label}</h4>
									<p className="text-sm text-muted-foreground mt-1">
										{result.item.description}
									</p>
								</Link>
							))}
						</div>
					) : query ? (
						<div className="py-10 text-center text-sm text-muted-foreground">
							Không tìm thấy kết quả
						</div>
					) : (
						<div className="py-10 text-center text-sm text-muted-foreground">
							Nhập để tìm kiếm...
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
