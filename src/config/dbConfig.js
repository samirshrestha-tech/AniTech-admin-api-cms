import mongoose from "mongoose";

export const dbConnect = () => {
  try {
    console.log(process.env.MONGO_URL);
    const connect = mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};
