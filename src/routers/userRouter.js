import express from "express";
import {
  getUserByEmail,
  insertUser,
  updateUserStatus,
} from "../model/user/UserModel.js";
import { checkPass, hassPassword } from "../utils/bcrypt.js";
import { newValidation } from "../middlewares/joiValidator.js";
import { clientResponder } from "../middlewares/response.js";
import { v4 as uuidv4 } from "uuid";
import {
  createNewSession,
  deleteSession,
} from "../model/session/SessionModel.js";
import {
  sendEmailVerification,
  sendEmailVerifiedNotification,
} from "../utils/nodemailer.js";
import { webToken } from "../utils/jsonHelper.js";

const router = express.Router();

// server side validation for sign up

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

// verify user email

router.post("/verify-email", async (req, res, next) => {
  try {
    // verify if the token and email exists in the session table and if it does we delete it, so user exists

    const { email, token } = req.body;

    const session = await deleteSession({ token, associate: email });

    if (session?._id) {
      // after the session has been deleted, we update the user status to active and send back verified email to the client
      const user = await updateUserStatus({ email }, { status: "active" });

      // send email notifications

      if (user?._id) {
        sendEmailVerifiedNotification({ fName: user.fName, email });
        return clientResponder.SUCCESS({
          res,
          message: "Your account has been veified. You can login now",
        });
      }
    }

    clientResponder.ERROR({
      res,
      message: "Invalid or expired link. Could not verify the email.Try again.",
    });
  } catch (error) {
    next(error);
  }
});

// user sign in

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await getUserByEmail(email);

      // check if the user status is active or not
      if (user?.status === "inactive") {
        return clientResponder.ERROR({
          res,
          message:
            "Sorry! Your account has not been verified. Please verify your account and try again",
        });
      }

      if (user?._id) {
        // compare the password from the form and the password saved in db
        const comparePass = checkPass(password, user.password);

        if (comparePass) {
          // create access and refresh token
          const jwt = await webToken(email);

          return clientResponder.SUCCESS({
            res,
            message: "You have logged in successfully.",
            jwt,
          });
        }
      }
    } else {
      return clientResponder.ERROR({
        res,
        message: "Email and Password are required.",
      });
    }

    // redirect the user to the dashboard
  } catch (error) {
    next(error);
  }
});

export default router;
