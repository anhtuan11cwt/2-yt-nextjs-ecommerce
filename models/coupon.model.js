import mongoose from "mongoose";

// Schema mã giảm giá
const couponSchema = new mongoose.Schema(
	{
		code: {
			index: true,
			required: true,
			trim: true,
			type: String,
			unique: true,
			uppercase: true,
		},
		deletedAt: {
			default: null,
			index: true,
			type: Date,
		},
		discountPercent: {
			max: 100,
			min: 1,
			required: true,
			type: Number,
		},
		minimumShoppingAmount: {
			min: 0,
			required: true,
			type: Number,
		},
		validity: {
			index: true,
			required: true,
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

const CouponModel =
	mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default CouponModel;
