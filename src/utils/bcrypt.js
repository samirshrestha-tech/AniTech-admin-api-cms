import bcrypt from "bcryptjs";

const salt = 15;

export const hassPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, salt);
};

export const checkPass = (password, hassPassword) => {
  return bcrypt.compareSync(password, hassPassword);
};
