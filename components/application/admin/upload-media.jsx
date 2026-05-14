"use client";

import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const UploadMedia = () => {
	const handleOnError = (error) => {
		toast.error(error?.statusText || "Tải lên thất bại");
	};

	const handleOnSuccess = async (results) => {
		const files = results?.info?.files || [];

		const uploadedFiles = files
			.filter((file) => file?.uploadInfo)
			.map((file) => ({
				assetId: file?.uploadInfo?.asset_id,
				path: file?.uploadInfo?.path,
				publicId: file?.uploadInfo?.public_id,
				secureUrl: file?.uploadInfo?.secure_url,
				thumbnailUrl: file?.uploadInfo?.thumbnail_url,
			}));

		if (uploadedFiles.length <= 0) {
			return;
		}

		try {
			const response = await fetch("/api/media/create", {
				body: JSON.stringify({
					media: uploadedFiles,
				}),
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message || "Tải lên thất bại");
			}

			toast.success("Tải media lên thành công");
		} catch (error) {
			toast.error(error.message || "Đã xảy ra lỗi");
		}
	};

	return (
		<CldUploadWidget
			config={{
				cloud: {
					apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
					cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
				},
			}}
			onError={handleOnError}
			onQueuesEnd={handleOnSuccess}
			options={{
				multiple: true,
				sources: ["local", "url", "unsplash", "google_drive"],
			}}
			signatureEndpoint="/api/cloudinary-signature"
			uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
		>
			{({ open }) => {
				return (
					<Button className="gap-2" onClick={() => open()}>
						<FiPlus />
						Tải Media
					</Button>
				);
			}}
		</CldUploadWidget>
	);
};

export default UploadMedia;
