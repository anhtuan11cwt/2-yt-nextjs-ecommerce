"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import slugify from "slugify";

import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import { MediaPickerModal } from "@/components/application/admin/media-picker-modal";
import { Button } from "@/components/ui/button";
import { decodeDescriptionFromStorage } from "@/lib/product-description";
import ADMIN_ROUTES from "@/routes/admin.routes";
import { productFormSchema } from "@/validators/product.validator";

const AdminRichTextEditor = dynamic(
	async () => {
		const mod = await import("@/components/application/admin/editor");
		return mod.AdminRichTextEditor;
	},
	{
		loading: () => (
			<div className="min-h-[300px] animate-pulse rounded-md bg-muted" />
		),
		ssr: false,
	},
);

function mediaDocToPickerItem(doc) {
	const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	const url =
		doc.secureUrl ||
		(doc.path
			? `https://res.cloudinary.com/${cloud}/image/upload/${doc.path}`
			: "");
	return { _id: String(doc._id), url };
}

function buildDefaultsFromProduct(product) {
	if (!product) {
		return {
			category: "",
			description: "",
			discountPercent: 0,
			media: [],
			mrp: "",
			name: "",
			sellingPrice: "",
		};
	}
	return {
		category: String(product.category?._id || product.category || ""),
		description: decodeDescriptionFromStorage(product.description || ""),
		discountPercent: product.discountPercent ?? 0,
		media: (product.media || []).map((m) => String(m._id)),
		mrp: String(product.mrp ?? ""),
		name: product.name || "",
		sellingPrice: String(product.sellingPrice ?? ""),
	};
}

export function ProductForm({ initialProduct }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const isEdit = Boolean(initialProduct);
	const productId = initialProduct?._id ? String(initialProduct._id) : "";
	const [mediaOpen, setMediaOpen] = useState(false);
	const [mediaItems, setMediaItems] = useState(() =>
		initialProduct
			? (initialProduct.media || []).map(mediaDocToPickerItem)
			: [],
	);

	const { data: categoriesRes } = useQuery({
		queryFn: async () => {
			const r = await fetch(
				"/api/category?page=1&limit=500&deleteType=SD&globalFilter=",
			);
			const j = await r.json();
			if (!r.ok) {
				throw new Error(j.message);
			}
			return j;
		},
		queryKey: ["product-form-categories"],
	});

	const categories = categoriesRes?.data || [];

	const form = useForm({
		defaultValues: buildDefaultsFromProduct(initialProduct),
		resolver: zodResolver(productFormSchema),
	});

	const { control, formState, handleSubmit, register, setValue } = form;

	const nameWatch = useWatch({ control, name: "name" });
	const mrpWatch = useWatch({ control, name: "mrp" });
	const sellingWatch = useWatch({ control, name: "sellingPrice" });

	const slugPreview = useMemo(
		() =>
			slugify(nameWatch || "ten-san-pham", {
				lower: true,
				strict: true,
				trim: true,
			}),
		[nameWatch],
	);

	useEffect(() => {
		const m =
			typeof mrpWatch === "number"
				? mrpWatch
				: Number.parseFloat(String(mrpWatch));
		const s =
			typeof sellingWatch === "number"
				? sellingWatch
				: Number.parseFloat(String(sellingWatch));
		if (m > 0 && s > 0 && s <= m) {
			const d = Math.round(((m - s) / m) * 100);
			setValue("discountPercent", d);
		}
	}, [mrpWatch, sellingWatch, setValue]);

	useEffect(() => {
		setValue(
			"media",
			mediaItems.map((m) => m._id),
		);
	}, [mediaItems, setValue]);

	const createMut = useMutation({
		mutationFn: async (payload) => {
			const r = await fetch("/api/product/create", {
				body: JSON.stringify(payload),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});
			const j = await r.json();
			if (!r.ok) {
				throw new Error(j.message);
			}
			return j;
		},
		onError: (e) => toast.error(e.message),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["datatable"] });
			toast.success("Tạo sản phẩm thành công");
			router.push(ADMIN_ROUTES.PRODUCT_SHOW);
		},
	});

	const updateMut = useMutation({
		mutationFn: async (payload) => {
			const r = await fetch(`/api/product/edit/${productId}`, {
				body: JSON.stringify(payload),
				headers: { "Content-Type": "application/json" },
				method: "PUT",
			});
			const j = await r.json();
			if (!r.ok) {
				throw new Error(j.message);
			}
			return j;
		},
		onError: (e) => toast.error(e.message),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["datatable"] });
			toast.success("Cập nhật sản phẩm thành công");
			router.push(ADMIN_ROUTES.PRODUCT_SHOW);
		},
	});

	const onValid = (data) => {
		if (isEdit) {
			updateMut.mutate(data);
		} else {
			createMut.mutate(data);
		}
	};

	const pending = createMut.isPending || updateMut.isPending;

	const breadcrumbBase = [
		{ href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
		{ href: ADMIN_ROUTES.PRODUCT_SHOW, label: "Sản phẩm" },
	];

	return (
		<div className="p-5">
			<AdminBreadcrumb
				breadcrumbData={
					isEdit
						? [...breadcrumbBase, { href: "#", label: "Chỉnh sửa" }]
						: [
								...breadcrumbBase,
								{ href: ADMIN_ROUTES.PRODUCT_ADD, label: "Thêm sản phẩm" },
							]
				}
			/>
			<h1 className="mb-5 text-2xl font-bold">
				{isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
			</h1>

			<form
				className="mx-auto max-w-3xl space-y-5"
				onSubmit={handleSubmit(onValid)}
			>
				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="name">
						Tên sản phẩm
					</label>
					<input
						className="h-10 w-full rounded-md border px-3"
						id="name"
						{...register("name")}
					/>
					{formState.errors.name ? (
						<p className="text-destructive mt-1 text-sm">
							{formState.errors.name.message}
						</p>
					) : null}
				</div>

				<div>
					<span className="mb-1 block text-sm font-medium">Slug (tự sinh)</span>
					<input
						className="bg-muted/40 h-10 w-full cursor-not-allowed rounded-md border px-3"
						readOnly
						type="text"
						value={slugPreview}
					/>
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="category">
						Danh mục
					</label>
					<select
						className="h-10 w-full rounded-md border bg-background px-3"
						id="category"
						{...register("category")}
					>
						<option value="">Chọn danh mục</option>
						{categories.map((c) => (
							<option key={c._id} value={c._id}>
								{c.name}
							</option>
						))}
					</select>
					{formState.errors.category ? (
						<p className="text-destructive mt-1 text-sm">
							{formState.errors.category.message}
						</p>
					) : null}
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1 block text-sm font-medium" htmlFor="mrp">
							Giá gốc (MRP)
						</label>
						<input
							className="h-10 w-full rounded-md border px-3"
							id="mrp"
							inputMode="decimal"
							step="any"
							type="number"
							{...register("mrp")}
						/>
						{formState.errors.mrp ? (
							<p className="text-destructive mt-1 text-sm">
								{formState.errors.mrp.message}
							</p>
						) : null}
					</div>
					<div>
						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="sellingPrice"
						>
							Giá bán
						</label>
						<input
							className="h-10 w-full rounded-md border px-3"
							id="sellingPrice"
							inputMode="decimal"
							step="any"
							type="number"
							{...register("sellingPrice")}
						/>
						{formState.errors.sellingPrice ? (
							<p className="text-destructive mt-1 text-sm">
								{formState.errors.sellingPrice.message}
							</p>
						) : null}
					</div>
				</div>

				<div>
					<label
						className="mb-1 block text-sm font-medium"
						htmlFor="discountPercent"
					>
						Giảm giá (%)
					</label>
					<input
						className="bg-muted/40 h-10 w-full cursor-not-allowed rounded-md border px-3"
						id="discountPercent"
						readOnly
						type="number"
						{...register("discountPercent", { valueAsNumber: true })}
					/>
				</div>

				<div>
					<span className="mb-1 block text-sm font-medium">Hình ảnh</span>
					<div className="flex flex-wrap items-center gap-3">
						<Button
							onClick={() => setMediaOpen(true)}
							type="button"
							variant="outline"
						>
							Chọn media
						</Button>
						<span className="text-muted-foreground text-sm">
							Đã chọn {mediaItems.length} ảnh
						</span>
					</div>
					{mediaItems.length > 0 ? (
						<div className="mt-3 flex flex-wrap gap-2">
							{mediaItems.map((item) => (
								<div
									className="relative h-20 w-20 overflow-hidden rounded-md border"
									key={item._id}
								>
									{item.url ? (
										<Image
											alt=""
											className="object-cover"
											fill
											sizes="80px"
											src={item.url}
										/>
									) : null}
								</div>
							))}
						</div>
					) : null}
					{formState.errors.media ? (
						<p className="text-destructive mt-1 text-sm">
							{formState.errors.media.message}
						</p>
					) : null}
				</div>

				<div>
					<span className="mb-1 block text-sm font-medium">Mô tả</span>
					<Controller
						control={control}
						name="description"
						render={({ field }) => (
							<AdminRichTextEditor
								key={isEdit ? productId : "new"}
								onChange={field.onChange}
								value={field.value}
							/>
						)}
					/>
				</div>

				<div className="flex flex-wrap gap-3">
					<Button disabled={pending} type="submit">
						{pending ? "Đang lưu..." : "Lưu"}
					</Button>
					<Button asChild type="button" variant="outline">
						<Link href={ADMIN_ROUTES.PRODUCT_SHOW}>Hủy</Link>
					</Button>
				</div>
			</form>

			<MediaPickerModal
				onChange={setMediaItems}
				onOpenChange={setMediaOpen}
				open={mediaOpen}
				value={mediaItems}
			/>
		</div>
	);
}
