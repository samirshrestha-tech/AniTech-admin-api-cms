import SessionSchema from "./SessionSchema.js";

export const createNewSession = (obj) => {
  return SessionSchema(obj).save();
};
