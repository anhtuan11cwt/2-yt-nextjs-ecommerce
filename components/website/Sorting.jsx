"use client";

import { SlidersHorizontal } from "lucide-react";

export default function Sorting({ sorting, setSorting, setOpenFilterSheet }) {
	return (
		<div className="mb-8 flex items-center justify-end gap-5 border-b pb-5">
			{/* Mobile filter button */}
			<button
				className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm lg:hidden"
				onClick={() => setOpenFilterSheet(true)}
				type="button"
			>
				<SlidersHorizontal size={16} />
				Bộ Lọc
			</button>

			<select
				className="w-[200px] rounded-md border px-3 py-2 text-sm outline-none"
				onChange={(e) => setSorting(e.target.value)}
				value={sorting}
			>
				<option value="default">Mặc Định</option>
				<option value="asc">Tên A-Z</option>
				<option value="desc">Tên Z-A</option>
				<option value="price-low-high">Giá Thấp-Cao</option>
				<option value="price-high-low">Giá Cao-Thấp</option>
			</select>
		</div>
	);
}
