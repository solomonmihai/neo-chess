import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import AuthRouter from "./routers/auth.js";
import controller from "./sockets/controller.js";

const app = express();
const server = createServer(app);

// socket.io controller
controller(server);

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json(), urlEncodedParser);

app.use(cors());

app.use("/auth", AuthRouter);

const dbURI = process.env.DB_URL;

connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to db ...");
  })
  .catch((err) => {
    console.log("error connecting to db", err);
  });

// TODO: check how to clear game id
// TODO: move game logic to server side

server.listen(3000, () => {
  console.log("listening ...");
});
