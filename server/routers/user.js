import { Router } from "express";

import User from "../models/user.js";

const UserRouter = Router();

UserRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  // TODO: check id first
  // TODO: don't send email address

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(400).send({ message: "user not found" });
  }

  return res.send({
    user: {
      username: user.username,
    },
  });
});

export default UserRouter;
