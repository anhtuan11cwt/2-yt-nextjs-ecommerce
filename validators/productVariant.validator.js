import { z } from "zod";

const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, "ID không hợp lệ");

const numberFromInput = z.preprocess((val) => {
	if (val === "" || val === undefined || val === null) {
		return 0;
	}
	if (typeof val === "number") {
		return val;
	}
	const n = Number.parseFloat(String(val));
	return Number.isFinite(n) ? n : 0;
}, z.number());

export const productVariantFormSchema = z
	.object({
		color: z.string().trim().min(1, "Nhập màu"),
		discountPercent: numberFromInput.pipe(z.number().min(0).max(100)),
		media: z.array(objectIdString),
		mrp: numberFromInput.pipe(z.number().min(0.01)),
		product: objectIdString,
		sellingPrice: numberFromInput.pipe(z.number().min(0.01)),
		size: z.string().trim().min(1, "Nhập kích cỡ"),
		sku: z.string().trim().min(1, "Nhập SKU").max(120, "SKU quá dài"),
	})
	.refine((data) => data.sellingPrice <= data.mrp, {
		message: "Giá bán không được vượt quá giá gốc",
		path: ["sellingPrice"],
	});
