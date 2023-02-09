import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { createAccessToken } from "../../lib/auth/tools.js";
import googleStrategy from "../../lib/auth/google.js";
import UsersModel from "./model.js";
import CommentModel from "../comments/model.js";
import mongoose from "mongoose";
const userRouter = express.Router();

userRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    console.log("POST");
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

userRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get(
  "/googleRedirect",
  passport.authenticate("google", async (req, res, next) => {})
);

userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate(req.user._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const author = await UsersModel.findById(req.params.userId);
    if (author) {
      res.send(author);
    } else {
      next(
        createHttpError(404, `BlogPost wit id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put(
  "/:userId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const updateAuthors = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true, runValidators: true }
      );
      if (updateAuthors) {
        res.send(updateAuthors);
      } else {
        next(
          createHttpError(404, `BlogPost wit id ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete(
  "/:userId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const deleteUser = await UsersModel.findByIdAndDelete(req.params.userId);
      if (deleteUser) {
        res.status(204).send("deleted");
      } else {
        next(
          createHttpError(404, `BlogPost wit id ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
