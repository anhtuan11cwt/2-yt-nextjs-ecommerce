import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		productId: {
			ref: "products",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
		},
		rating: {
			max: 5,
			min: 1,
			required: true,
			type: Number,
		},
		review: {
			required: true,
			type: String,
		},
		title: {
			required: true,
			type: String,
		},
		userId: {
			ref: "users",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{
		timestamps: true,
	},
);

const ReviewModel =
	mongoose.models.reviews || mongoose.model("reviews", reviewSchema);

export default ReviewModel;
