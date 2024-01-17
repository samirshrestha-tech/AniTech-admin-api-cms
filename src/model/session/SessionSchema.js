import mongoose from "mongoose";

const sessionschema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },

    associate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Session", sessionschema);
