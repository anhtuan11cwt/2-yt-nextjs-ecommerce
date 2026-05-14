"use client";

import { Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MediaBlock = ({
	media,
	selectedMedia,
	setSelectedMedia,
	isMultiple = true,
}) => {
	const handleCheck = (checked) => {
		if (checked) {
			if (isMultiple) {
				setSelectedMedia((prev) => [
					...prev,
					{
						_id: media._id,
						url: media.secureUrl,
					},
				]);
			} else {
				setSelectedMedia([
					{
						_id: media._id,
						url: media.secureUrl,
					},
				]);
			}
		} else {
			setSelectedMedia((prev) => prev.filter((item) => item._id !== media._id));
		}
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(media.secureUrl);
		toast.success("URL đã sao chép vào clipboard");
	};

	const isChecked = selectedMedia.some((item) => item._id === media._id);
	const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	const imageUrl =
		media.secureUrl ||
		(media.path
			? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${media.path}`
			: null);

	if (!imageUrl) {
		return null;
	}

	return (
		<div className="group relative overflow-hidden rounded-xl border bg-background">
			<div className="relative aspect-square overflow-hidden bg-muted">
				<Image
					alt={media.publicId || "media-image"}
					className="object-cover transition duration-300 group-hover:scale-105"
					fill
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
					src={imageUrl}
				/>

				<div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/40" />

				<div className="absolute left-3 top-3 z-20">
					<Checkbox
						checked={isChecked}
						className="border-white bg-white"
						onCheckedChange={handleCheck}
					/>
				</div>

				<div className="absolute right-3 top-3 z-20">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="h-8 w-8 opacity-0 transition group-hover:opacity-100"
								size="icon"
								variant="secondary"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link href={`/admin/media/edit/${media._id}`}>
									<Pencil className="mr-2 h-4 w-4" />
									Chỉnh sửa
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem onClick={handleCopy}>
								<Copy className="mr-2 h-4 w-4" />
								Sao chép Link
							</DropdownMenuItem>

							<DropdownMenuItem className="text-red-500">
								<Trash2 className="mr-2 h-4 w-4" />
								Chuyển vào Thùng rác
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="p-3">
				<h3 className="line-clamp-1 text-sm font-medium">
					{media.publicId.split("/").pop()}
				</h3>
				<p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
					{media.publicId}
				</p>
			</div>
		</div>
	);
};

export default MediaBlock;
