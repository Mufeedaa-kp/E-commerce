
const mongoose = require("mongoose");
 
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  isActive: {
  type: Boolean,
  default: true,
},
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    

  },
  {
    timestamps: true,
  }
);
 

userSchema.index({ role: 1, isBlocked: 1, isActive:1 });
 
module.exports = mongoose.model("User", userSchema);
 
