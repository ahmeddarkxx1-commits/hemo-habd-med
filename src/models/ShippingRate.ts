import mongoose from "mongoose";

const ShippingRateSchema = new mongoose.Schema(
  {
    governorate: {
      type: String,
      required: true,
      unique: true,
    },
    rate: {
      type: Number,
      required: true,
      default: 50,
    },
    estimatedDays: {
      type: String,
      default: "3-5 أيام",
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.ShippingRate || mongoose.model("ShippingRate", ShippingRateSchema);
