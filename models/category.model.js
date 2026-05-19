import mongoose from "mongoose";

// Schema danh mục sản phẩm
const categorySchema = new mongoose.Schema(
  {
    deletedAt: {
      default: null,
      index: true,
      type: Date,
    },
    name: {
      required: true,
      trim: true,
      type: String,
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

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
