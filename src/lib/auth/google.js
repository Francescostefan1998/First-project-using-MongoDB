import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../../api/user/model.js";
import { createAccessToken } from "./tools.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_URL}/users/googleRedirect`,
  },
  (accesataoken, refresToken, profile, passportNext) => {
    console.log(profile);
  }
);

export default googleStrategy;
