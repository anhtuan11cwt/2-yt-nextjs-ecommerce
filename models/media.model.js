import mongoose from "mongoose";

// Schema lưu thông tin media từ Cloudinary
const MediaSchema = new mongoose.Schema(
  {
    alt: {
      type: String,
    },
    assetId: {
      required: true,
      trim: true,
      type: String,
    },

    deletedAt: {
      default: null,
      index: true,
      type: Date,
    },

    path: {
      required: true,
      type: String,
    },

    publicId: {
      required: true,
      trim: true,
      type: String,
    },

    thumbnailUrl: {
      type: String,
    },

    title: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const MediaModel =
  mongoose.models.Media || mongoose.model("Media", MediaSchema);

export default MediaModel;
