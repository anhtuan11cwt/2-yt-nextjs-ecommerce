import mongoose from "mongoose";

// Schema sản phẩm
const productSchema = new mongoose.Schema(
  {
    category: {
      ref: "Category",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    deletedAt: {
      default: null,
      index: true,
      type: Date,
    },
    description: {
      default: "",
      type: String,
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
    name: {
      required: true,
      trim: true,
      type: String,
    },
    sellingPrice: {
      min: 0,
      required: true,
      type: Number,
    },
    slug: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ category: 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
