
const mongoose = require("mongoose");
 
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      
    },
    price: {
      type: Number,
      required: true,
    
    },
    description: String,
    image: String,
    rating: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      
    },
    stock: {
      type: Number,
      default: 0,
    },
    sizes: [String],
    variants: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
  type: Boolean,
  default: true,
},
  },
  {
    timestamps: true,
  }
);
 

productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: "text", description: "text" });
 
module.exports = mongoose.model("Product", productSchema);
 
