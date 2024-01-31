import SessionSchema from "./SessionSchema.js";

export const createNewSession = (obj) => {
  return SessionSchema(obj).save();
};

// delete the session from session table

export const deleteSession = (filter) => {
  return SessionSchema.findOneAndDelete(filter);
};
