import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },

    role: {
      type: String,
      default: "user",
    },

    fName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
    phone: {
      type: Number,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
