import UserSchema from "./UserSchema.js";

// insert new user

export const insertUser = (obj) => {
  return UserSchema(obj).save();
};

export const updateUserStatus = (filter, update) => {
  return UserSchema.findOneAndUpdate(filter, update, { new: true });
};

export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};
