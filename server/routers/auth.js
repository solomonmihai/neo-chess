import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import verifyToken from "../middleware/auth.js";

const AuthRouter = Router();

AuthRouter.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("username").notEmpty().toLowerCase(),
  body("password").isLength({ min: 6, max: 16 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (errors.errors[0].param == "email") {
        return res.status(400).send("invalid email");
      }
      if (errors.errors[0].param == "username") {
        return res.status(400).send("invalid username");
      }
      if (errors.errors[0].param == "password") {
        return res
          .status(400)
          .send("password must be between 6 and 16 chars and needs 1 number");
      }
    }

    const { email, username, password } = req.body;

    const emailTaken = await User.findOne({ email });
    const usernameTaken = await User.findOne({ username });

    if (emailTaken) {
      return res.status(400).send("email taken");
    }
    if (usernameTaken) {
      return res.status(400).send("username taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    return res.send("user registered successfully");
  }
);

AuthRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send("username not found");
  }

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      return res.status(400).send("incorrect password");
    }

    const payload = {
      id: user._id,
      username,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          return res.status(400).send(`erorr generating jwt ${err}`);
        }

        return res.send(`Bearer ${token}`);
      }
    );
  });
});

AuthRouter.get("/", verifyToken, async (req, res) => {
  return res.send('authenticated')
});

export default AuthRouter;
