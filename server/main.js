import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import cors from "cors";

import { addPlayer, game, removePlayer } from "./game.js";
import AuthRouter from "./routers/auth.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

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
    console.log("server error", err);
  });

// TODO: check how to clear game id
// TODO: move game logic to server side

io.on("connection", (socket) => {
  socket.on("join", ({ name, gameID }, callback) => {
    const { error, player, opponent } = addPlayer({
      name,
      id: socket.id,
      gameID,
    });

    if (error) {
      return callback({ error });
    }

    socket.join(gameID);
    callback({ color: player.color });

    socket.emit("welcome", {
      message: `hello ${player.name}`,
      opponent,
    });

    socket.broadcast.to(player.gameID).emit("opponentJoin", {
      message: `${player.name} joined`,
      opponent: player,
    });

    if (game(gameID).length >= 2) {
      const white = game(gameID).find((p) => p.color == "w");
      io.to(gameID).emit("message", {
        message: `white (${white}) goes first`,
      });
    }

    socket.on("move", ({ from, to, gameID }) => {
      socket.broadcast.to(gameID).emit("opponentMove", { from, to });
    });

    socket.on("disconnect", () => {
      const player = removePlayer(socket.id);
      if (player) {
        io.to(player.game).emit("message", {
          message: `${player.name} has left the game`,
        });
        socket.broadcast.to(player.game).emit("opponentLeft");
      }
    });
  });
});

server.listen(3000, () => {
  console.log("listening ...");
});
