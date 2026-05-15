"use client";

import * as Accordion from "@radix-ui/react-accordion";
import * as Slider from "@radix-ui/react-slider";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Component sidebar bộ lọc cho trang Shop
export default function FiltersSidebar() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [categories, setCategories] = useState([]);
	const [colors, setColors] = useState([]);
	const [sizes, setSizes] = useState([]);

	// Khởi tạo state từ URL params (lazy initialization)
	const [selectedCategories, setSelectedCategories] = useState(() => {
		const category = searchParams.get("category");
		return category ? category.split(",") : [];
	});
	const [selectedColors, setSelectedColors] = useState(() => {
		const color = searchParams.get("color");
		return color ? color.split(",") : [];
	});
	const [selectedSizes, setSelectedSizes] = useState(() => {
		const size = searchParams.get("size");
		return size ? size.split(",") : [];
	});
	const [priceFilter, setPriceFilter] = useState(() => {
		const min = searchParams.get("min");
		const max = searchParams.get("max");
		return min && max ? [Number(min), Number(max)] : [100, 5000];
	});

	// Lấy dữ liệu filter từ API
	useEffect(() => {
		const fetchFilters = async () => {
			try {
				const [categoryRes, colorRes, sizeRes] = await Promise.all([
					axios.get("/api/category/get-category"),
					axios.get("/api/product-variant/colors"),
					axios.get("/api/product-variant/sizes"),
				]);

				setCategories(categoryRes.data.categories);
				setColors(colorRes.data.colors);
				setSizes(sizeRes.data.sizes);
			} catch (error) {
				console.log(error);
			}
		};

		fetchFilters();
	}, []);

	// Cập nhật URL query params khi filter thay đổi
	useEffect(() => {
		const params = new URLSearchParams();

		if (selectedCategories.length > 0) {
			params.set("category", selectedCategories.join(","));
		}

		if (selectedColors.length > 0) {
			params.set("color", selectedColors.join(","));
		}

		if (selectedSizes.length > 0) {
			params.set("size", selectedSizes.join(","));
		}

		params.set("min", priceFilter[0]);
		params.set("max", priceFilter[1]);

		router.push(`/website/shop?${params.toString()}`);
	}, [selectedCategories, selectedColors, selectedSizes, priceFilter, router]);

	const toggleCategory = (value) => {
		setSelectedCategories((prev) =>
			prev.includes(value)
				? prev.filter((item) => item !== value)
				: [...prev, value],
		);
	};

	const toggleColor = (value) => {
		setSelectedColors((prev) =>
			prev.includes(value)
				? prev.filter((item) => item !== value)
				: [...prev, value],
		);
	};

	const toggleSize = (value) => {
		setSelectedSizes((prev) =>
			prev.includes(value)
				? prev.filter((item) => item !== value)
				: [...prev, value],
		);
	};

	const clearFilters = () => {
		setSelectedCategories([]);
		setSelectedColors([]);
		setSelectedSizes([]);
		setPriceFilter([100, 5000]);
		router.push("/website/shop");
	};

	const hasActiveFilters =
		selectedCategories.length > 0 ||
		selectedColors.length > 0 ||
		selectedSizes.length > 0 ||
		priceFilter[0] !== 100 ||
		priceFilter[1] !== 5000;

	return (
		<div className="space-y-4">
			<Accordion.Root className="space-y-4" type="multiple">
				{/* Categories */}
				<Accordion.Item className="rounded-xl border" value="categories">
					<Accordion.Trigger className="flex w-full items-center justify-between px-4 py-4 font-semibold">
						Danh Mục
						<ChevronDown size={18} />
					</Accordion.Trigger>

					<Accordion.Content className="px-4 pb-4">
						<div className="space-y-3">
							{categories.map((category) => (
								<label className="flex items-center gap-3" key={category._id}>
									<input
										checked={selectedCategories.includes(category.slug)}
										className="h-4 w-4 rounded"
										onChange={() => toggleCategory(category.slug)}
										type="checkbox"
									/>
									<span className="text-sm">{category.name}</span>
								</label>
							))}
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Colors */}
				<Accordion.Item className="rounded-xl border" value="colors">
					<Accordion.Trigger className="flex w-full items-center justify-between px-4 py-4 font-semibold">
						Màu Sắc
						<ChevronDown size={18} />
					</Accordion.Trigger>

					<Accordion.Content className="px-4 pb-4">
						<div className="space-y-3">
							{colors.map((color) => (
								<label className="flex items-center gap-3" key={color}>
									<input
										checked={selectedColors.includes(color)}
										className="h-4 w-4 rounded"
										onChange={() => toggleColor(color)}
										type="checkbox"
									/>
									<span className="text-sm capitalize">{color}</span>
								</label>
							))}
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Sizes */}
				<Accordion.Item className="rounded-xl border" value="sizes">
					<Accordion.Trigger className="flex w-full items-center justify-between px-4 py-4 font-semibold">
						Kích Thước
						<ChevronDown size={18} />
					</Accordion.Trigger>

					<Accordion.Content className="px-4 pb-4">
						<div className="space-y-3">
							{sizes.map((item) => (
								<label className="flex items-center gap-3" key={item.size}>
									<input
										checked={selectedSizes.includes(item.size)}
										className="h-4 w-4 rounded"
										onChange={() => toggleSize(item.size)}
										type="checkbox"
									/>
									<span className="text-sm">{item.size}</span>
								</label>
							))}
						</div>
					</Accordion.Content>
				</Accordion.Item>

				{/* Price */}
				<Accordion.Item className="rounded-xl border" value="price">
					<Accordion.Trigger className="flex w-full items-center justify-between px-4 py-4 font-semibold">
						Giá
						<ChevronDown size={18} />
					</Accordion.Trigger>

					<Accordion.Content className="px-4 pb-6">
						<Slider.Root
							className="relative flex h-5 w-full items-center"
							max={5000}
							min={100}
							minStepsBetweenThumbs={1}
							onValueChange={setPriceFilter}
							step={100}
							value={priceFilter}
						>
							<Slider.Track className="relative h-2 grow rounded-full bg-gray-200">
								<Slider.Range className="absolute h-full rounded-full bg-black" />
							</Slider.Track>

							<Slider.Thumb className="block h-5 w-5 rounded-full bg-black" />
							<Slider.Thumb className="block h-5 w-5 rounded-full bg-black" />
						</Slider.Root>

						<div className="mt-4 flex justify-between text-sm">
							<span>
								{priceFilter[0].toLocaleString("vi-VN", {
									currency: "VND",
									style: "currency",
								})}
							</span>
							<span>
								{priceFilter[1].toLocaleString("vi-VN", {
									currency: "VND",
									style: "currency",
								})}
							</span>
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>

			{/* Clear Filters */}
			{hasActiveFilters && (
				<button
					className="w-full rounded-xl bg-black py-3 text-white transition-all hover:opacity-90"
					onClick={clearFilters}
					type="button"
				>
					Xóa Bộ Lọc
				</button>
			)}
		</div>
	);
}
