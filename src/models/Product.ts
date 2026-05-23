import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  material: string;
  isFeatured: boolean;
  inStock: boolean;
  salesCount: number;
  reviews: {
    userName: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
  createdAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    material: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    salesCount: { type: Number, default: 0 },
    reviews: [
      {
        userName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times in Next.js development
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
