import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		content: {
			required: true,
			trim: true,
			type: String,
		},
		deletedAt: {
			default: null,
			index: true,
			type: Date,
		},
		product: {
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
		title: {
			required: true,
			trim: true,
			type: String,
		},
		user: {
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
