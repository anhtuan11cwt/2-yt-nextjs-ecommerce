import mongoose from "mongoose";

// Schema đơn hàng
const orderSchema = new mongoose.Schema(
	{
		deletedAt: { default: null, type: Date },
		orderStatus: {
			default: "Pending",
			enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
			type: String,
		},
		paymentStatus: {
			default: "Pending",
			enum: ["Pending", "Paid", "Failed"],
			type: String,
		},
		products: [
			{
				price: { required: true, type: Number },
				product: {
					ref: "Product",
					required: true,
					type: mongoose.Schema.Types.ObjectId,
				},
				quantity: { required: true, type: Number },
			},
		],
		totalAmount: { required: true, type: Number },
		user: {
			ref: "User",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{ timestamps: true },
);

const OrderModel =
	mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;
