import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import verifyToken from "../middleware/auth.js";

const AuthRouter = Router();

function getJWT(user) {
  const payload = {
    id: user._id,
    username: user.username,
  };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      function (err, token) {
        if (err) {
          reject(err);
        } else {
          resolve(`Bearer ${token}`);
        }
      }
    );
  });
}

AuthRouter.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("username").notEmpty().toLowerCase(),
  body("password").isLength({ min: 6, max: 16 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (errors.errors[0].param == "email") {
        return res.status(400).send({ email: "invalid email" });
      }
      if (errors.errors[0].param == "username") {
        return res.status(400).send({ username: "invalid username" });
      }
      if (errors.errors[0].param == "password") {
        return res.status(400).send({
          password:
            "password must be between 6 and 16 chars and needs 1 number",
        });
      }
    }

    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).send({ confirmPassword: "passwords don't match" });
    }

    const { email, username, password } = req.body;

    const emailTaken = await User.findOne({ email });
    const usernameTaken = await User.findOne({ username });

    if (emailTaken) {
      return res.status(400).send({ email: "email taken" });
    }
    if (usernameTaken) {
      return res.status(400).send({ username: "username taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    try {
      const token = await getJWT(newUser);
      return res.send({ token, user: newUser });
    } catch (err) {}
  }
);

AuthRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send({ username: "username not found" });
  }

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) {
      return res.status(400).send({ password: "incorrect password" });
    }

    getJWT(user)
      .then((token) => {
        return res.send({ token, user });
      })
      .catch((err) => {
        return res.status(400).send(`error genertaing token: ${err}`);
      });
  });
});

AuthRouter.get("/", verifyToken, async (req, res) => {
  return res.send({ user: req.user });
});

export default AuthRouter;
