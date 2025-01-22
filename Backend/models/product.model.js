import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Engine", "Tires", "Electronics", "Brakes", "Accessories"], 
    },
    image: {
      type: String,
      required: true,
    },
    creator: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
