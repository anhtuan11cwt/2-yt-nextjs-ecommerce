import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		couponCode: { default: "", type: String },
		couponDiscount: { default: 0, type: Number },
		deletedAt: { default: null, type: Date },
		orderNote: { default: "", type: String },
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
				color: { type: String },
				image: { default: "", type: String },
				name: { default: "", type: String },
				price: { required: true, type: Number },
				product: {
					ref: "Product",
					required: true,
					type: mongoose.Schema.Types.ObjectId,
				},
				quantity: { required: true, type: Number },
				size: { type: String },
				variant: {
					ref: "ProductVariant",
					type: mongoose.Schema.Types.ObjectId,
				},
			},
		],
		shippingAddress: {
			city: { type: String },
			email: { type: String },
			landmark: { type: String },
			name: { type: String },
			phone: { type: String },
			pincode: { type: String },
			state: { type: String },
		},
		stripePaymentIntentId: { default: "", type: String },
		stripeSessionId: { default: "", type: String },
		totalAmount: { required: true, type: Number },
		user: {
			default: null,
			ref: "User",
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{ timestamps: true },
);

const OrderModel =
	mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;
