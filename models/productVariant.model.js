import mongoose from "mongoose";

// Schema biến thể sản phẩm (màu, size, SKU)
const productVariantSchema = new mongoose.Schema(
	{
		color: {
			required: true,
			trim: true,
			type: String,
		},
		deletedAt: {
			default: null,
			index: true,
			type: Date,
		},
		discountPercent: {
			default: 0,
			min: 0,
			type: Number,
		},
		media: [
			{
				ref: "Media",
				type: mongoose.Schema.Types.ObjectId,
			},
		],
		mrp: {
			min: 0,
			required: true,
			type: Number,
		},
		product: {
			index: true,
			ref: "Product",
			required: true,
			type: mongoose.Schema.Types.ObjectId,
		},
		sellingPrice: {
			min: 0,
			required: true,
			type: Number,
		},
		size: {
			required: true,
			trim: true,
			type: String,
		},
		sku: {
			required: true,
			trim: true,
			type: String,
			uppercase: true,
		},
	},
	{ timestamps: true },
);

// Tự động tính % giảm giá trước khi lưu
productVariantSchema.pre("save", function (next) {
	if (this.mrp > 0 && Number.isFinite(this.sellingPrice)) {
		this.discountPercent = Math.round(
			((this.mrp - this.sellingPrice) / this.mrp) * 100,
		);
	} else {
		this.discountPercent = 0;
	}
	if (typeof next === "function") {
		next();
	}
});

// Index unique cho combo (product + color + size)
productVariantSchema.index(
	{ color: 1, product: 1, size: 1 },
	{
		partialFilterExpression: { deletedAt: null },
		unique: true,
	},
);

// Index unique cho SKU
productVariantSchema.index(
	{ sku: 1 },
	{
		partialFilterExpression: { deletedAt: null },
		unique: true,
	},
);

const ProductVariant =
	mongoose.models.ProductVariant ||
	mongoose.model("ProductVariant", productVariantSchema);

export default ProductVariant;
