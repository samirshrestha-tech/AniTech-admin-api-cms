import bcrypt from "bcryptjs";

const salt = 15;

export const hassPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, salt);
};
