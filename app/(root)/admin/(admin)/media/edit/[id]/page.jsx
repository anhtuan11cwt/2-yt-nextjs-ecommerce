"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";

const breadcrumbData = [
	{ href: "/admin/dashboard", label: "Bảng điều khiển" },
	{ href: "/admin/media", label: "Hình ảnh" },
	{ label: "Chỉnh sửa" },
];

const EditMediaPage = () => {
	const params = useParams();
	const router = useRouter();
	const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

	const { data, loading, error } = useFetch({
		url: `/api/media/get/${params.id}`,
	});

	const [alt, setAlt] = useState("");
	const [title, setTitle] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (data?.media) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setAlt(data.media.alt || "");
			setTitle(data.media.title || "");
		}
	}, [data]);

	const imageUrl =
		data?.media?.secureUrl ||
		(data?.media?.path
			? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${data?.media?.path}`
			: null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setSubmitting(true);

			const response = await fetch("/api/media/update", {
				body: JSON.stringify({ alt, id: params.id, title }),
				headers: { "Content-Type": "application/json" },
				method: "PUT",
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message);
			}

			toast.success(result.message);
			router.push("/admin/media");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div>
				<AdminBreadcrumb breadcrumbData={breadcrumbData} />
				<div className="grid gap-5 lg:grid-cols-2">
					<div className="aspect-square rounded-xl bg-muted animate-pulse" />
					<div className="space-y-4">
						<div className="h-10 rounded-md bg-muted animate-pulse" />
						<div className="h-10 rounded-md bg-muted animate-pulse" />
						<div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<AdminBreadcrumb breadcrumbData={breadcrumbData} />
				<div className="text-red-500">Tải media thất bại: {error}</div>
			</div>
		);
	}

	return (
		<div>
			<AdminBreadcrumb breadcrumbData={breadcrumbData} />

			<div className="grid gap-5 lg:grid-cols-2">
				<div className="rounded-xl border p-4">
					<div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
						{imageUrl ? (
							<Image
								alt={alt || "media"}
								className="object-cover"
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								src={imageUrl}
							/>
						) : (
							<div className="flex h-full items-center justify-center text-muted-foreground">
								Không có ảnh
							</div>
						)}
					</div>
				</div>

				<div className="rounded-xl border p-5">
					<form className="space-y-5" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<label className="text-sm font-medium" htmlFor="alt">
								Alt Text
							</label>
							<Input
								id="alt"
								onChange={(e) => setAlt(e.target.value)}
								placeholder="Nhập alt text"
								value={alt}
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium" htmlFor="title">
								Tiêu đề
							</label>
							<Input
								id="title"
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Nhập tiêu đề"
								value={title}
							/>
						</div>

						<Button disabled={submitting} type="submit">
							{submitting ? "Đang cập nhật..." : "Cập nhật Media"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditMediaPage;
