import UserSchema from "./UserSchema.js";

// insert new user

export const insertUser = (obj) => {
  return UserSchema(obj).save();
};
