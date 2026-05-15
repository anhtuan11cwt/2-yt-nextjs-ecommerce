"use client";

import { SlidersHorizontal } from "lucide-react";

// Component thanh sorting cho trang Shop
export default function Sorting({
	limit,
	setLimit,
	sorting,
	setSorting,
	setOpenFilterSheet,
}) {
	return (
		<div className="mb-8 flex items-center justify-between gap-5 border-b pb-5">
			{/* LEFT */}
			<div className="flex items-center gap-3">
				{/* Mobile filter button */}
				<button
					className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm lg:hidden"
					onClick={() => setOpenFilterSheet(true)}
					type="button"
				>
					<SlidersHorizontal size={16} />
					Bộ Lọc
				</button>

				{/* Limit selector */}
				<div className="hidden items-center gap-2 lg:flex">
					{[9, 12, 18, 24].map((item) => (
						<button
							className={`rounded-md border px-4 py-2 text-sm transition-all ${
								limit === item ? "bg-black text-white" : "hover:bg-gray-100"
							}`}
							key={item}
							onClick={() => setLimit(item)}
							type="button"
						>
							{item}
						</button>
					))}
				</div>
			</div>

			{/* RIGHT */}
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
