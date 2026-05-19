import { z } from "zod";

// Regex kiểm tra ObjectId MongoDB
const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, "ID không hợp lệ");

// Xử lý input số từ form
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

// Schema validation form sản phẩm
export const productFormSchema = z
  .object({
    category: objectIdString,
    description: z.string(),
    discountPercent: numberFromInput.pipe(z.number().min(0).max(100)),
    media: z.array(objectIdString),
    mrp: numberFromInput.pipe(z.number().min(0.01)),
    name: z
      .string()
      .trim()
      .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự")
      .max(200, "Tên sản phẩm quá dài"),
    sellingPrice: numberFromInput.pipe(z.number().min(0.01)),
  })
  .refine((data) => data.sellingPrice <= data.mrp, {
    message: "Giá bán không được vượt quá giá gốc",
    path: ["sellingPrice"],
  });
