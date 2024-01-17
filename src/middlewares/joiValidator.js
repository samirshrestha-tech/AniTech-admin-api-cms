import joi from "joi";
import { clientResponder } from "./response.js";

const SHORTSTR = joi.string();

const SHORTSTRREQ = SHORTSTR.required();

const EMAILSTR = SHORTSTR.email({ minDomainSegments: 2 }).required();
const PHONESTR = joi.number().allow(null);

const validator = ({ schema, req, res, next }) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      return clientResponder.ERROR({ res, message: error.message });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const newValidation = (req, res, next) => {
  const schema = joi.object({
    fName: SHORTSTRREQ,
    lastName: SHORTSTRREQ,
    email: EMAILSTR,
    phone: PHONESTR,
    password: SHORTSTRREQ,
  });

  validator({ schema, req, res, next });
};
