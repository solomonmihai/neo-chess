import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import AuthRouter from "./routers/auth.js";
import UserRouter from "./routers/user.js";
import GameRouter from "./routers/game.js";

import controller from "./sockets/controller.js";

const app = express();
const server = createServer(app);

// socket.io controller
controller(server);

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json(), urlEncodedParser);

app.use(cors());

app.use("/auth", AuthRouter);
app.use("/game", GameRouter);
app.use("/user", UserRouter);

const dbURI = process.env.DB_URL;

connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to db ...");
  })
  .catch((err) => {
    console.log("error connecting to db", err);
  });

server.listen(3000, () => {
  console.log("listening ...");
});
