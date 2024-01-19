import express from "express";
import { insertUser } from "../model/user/UserModel.js";
import { hassPassword } from "../utils/bcrypt.js";
import { newValidation } from "../middlewares/joiValidator.js";
import { clientResponder } from "../middlewares/response.js";
import { v4 as uuidv4 } from "uuid";
import { createNewSession } from "../model/session/SessionModel.js";
import { sendEmailVerification } from "../utils/nodemailer.js";

const router = express.Router();

// server side validation

router.post("/", newValidation, async (req, res, next) => {
  try {
    const { password } = req.body;

    // encrypt the password

    req.body.password = hassPassword(password);

    const user = await insertUser(req.body);

    // if the user is created, create unique url and email that to the user.

    if (user?._id) {
      // creating unique token and saving it to sessionschema to associate it with the user email.
      const c = uuidv4();

      const token = await createNewSession({ token: c, associate: user.email });

      if (token?._id) {
        const url = `${process.env.CLIENT_ROOT_DOMAIN}/verify-email?e=${user.email}&c=${c}`;

        console.log(url);

        sendEmailVerification({ email: user.email, url, fName: user.fName });
      }

      // send the email
    }

    user?._id
      ? clientResponder.SUCCESS({
          res,
          message: "Check your email to verify your account.",
        })
      : clientResponder.ERROR({
          res,
          message: "Unable to create your account",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.errorCode = 200;
      error.message = "There is already an user with that email id";
    }
    next(error);
  }
});

export default router;
