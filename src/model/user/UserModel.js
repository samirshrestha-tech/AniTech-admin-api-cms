import UserSchema from "./UserSchema.js";

// insert new user

export const insertUser = (obj) => {
  return UserSchema(obj).save();
};

// for verifying the user status

export const updateUserStatus = (filter, update) => {
  return UserSchema.findOneAndUpdate(filter, update, { new: true });
};

export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};

// find the user email and associate the refresh token to the user table
