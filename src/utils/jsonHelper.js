import json from "jsonwebtoken";
import { createNewSession } from "../model/session/SessionModel.js";
import { updateUserStatus } from "../model/user/UserModel.js";

export const createAccessToken = async (email) => {
  // creating access token using user email as payload
  const accessToken = json.sign(
    {
      email,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" }
  );

  await createNewSession({ token: accessToken, associate: email });

  //save the access token in a seperate session table in db

  return accessToken;
};

export const createRefreshToken = async (email) => {
  // creating access token using user email as payload
  const refreshToken = json.sign(
    {
      email,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "30d" }
  );

  await updateUserStatus({ email }, { refreshToken });

  //save the refresh token in a seperate session table in db

  return refreshToken;
};

export const webToken = async (email) => {
  return {
    accessToken: await createAccessToken(email),
    refreshToken: await createRefreshToken(email),
  };
};
