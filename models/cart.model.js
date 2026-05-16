import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
	{
		product: {
			ref: "Product",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
		},
		quantity: { min: 1, required: true, type: Number },
		variant: {
			ref: "ProductVariant",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{ _id: false },
);

const cartSchema = new mongoose.Schema(
	{
		items: [cartItemSchema],
		user: {
			ref: "User",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
			unique: true,
		},
	},
	{ timestamps: true },
);

const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default CartModel;
