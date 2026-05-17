import mongoose from "mongoose";

// Schema đánh giá sản phẩm
const reviewSchema = new mongoose.Schema(
	{
		deletedAt: {
			default: null,
			index: true,
			type: Date,
		},
		productId: {
			index: true,
			ref: "Product",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
		},
		rating: {
			index: true,
			max: 5,
			min: 1,
			required: true,
			type: Number,
		},
		review: {
			required: true,
			trim: true,
			type: String,
		},
		title: {
			required: true,
			trim: true,
			type: String,
		},
		userId: {
			index: true,
			ref: "User",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{
		timestamps: true,
	},
);

const ReviewModel =
	mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default ReviewModel;
