"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import SearchModal from "./search-modal";

// Input tìm kiếm với phím tắt Ctrl+K
export default function AdminSearch() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const down = (e) => {
			if (e.ctrlKey && e.key === "k") {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<button
				className="w-full h-11 border rounded-xl px-4 flex items-center gap-3 text-sm text-muted-foreground bg-background hover:bg-muted/50 transition-all"
				onClick={() => setOpen(true)}
				type="button"
			>
				<Search size={18} />
				<span className="flex-1 text-left">Tìm kiếm...</span>
				<kbd className="hidden md:flex items-center justify-center px-2 py-1 rounded-md border text-xs bg-muted">
					Ctrl K
				</kbd>
			</button>

			<SearchModal open={open} setOpen={setOpen} />
		</>
	);
}
