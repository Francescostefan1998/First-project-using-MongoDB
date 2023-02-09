import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../../api/user/model.js";
import { createAccessToken } from "./tools.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_URL}/users/googleRedirect`,
  },
  async (accesataoken, refresToken, profile, passportNext) => {
    console.log(profile);
    try {
      const { email, given_name, family_name } = profile._json;

      const user = await UserModel.findOne({ email });
      if (user) {
        const accessToken = await createAccessToken({
          _id: user._id,
          role: user.role,
        });
        passportNext(null, { accessToken });
      } else {
        const newUser = new UserModel({
          firstName: given_name,
          lastName: family_name,
          email,
          googleId: profile.id,
        });
        const createdUser = await newUser.save();

        const accessToken = await createAccessToken({
          _id: createdUser._id,
          role: createdUser.role,
        });
        passportNext(null, { accessToken });
      }
    } catch (error) {
      console.log(error);
      passportNext(error);
    }
  }
);

export default googleStrategy;
