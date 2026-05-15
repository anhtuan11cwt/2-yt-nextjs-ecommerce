import { z } from "zod";

export const createCouponSchema = z.object({
	code: z.string().min(3).max(20).trim(),
	discountPercent: z.number().min(1).max(100),
	minimumShoppingAmount: z.number().min(0),
	validity: z.string(),
});
