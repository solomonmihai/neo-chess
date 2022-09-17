import { Server } from "socket.io";
import Game from "./gameManager.js";

const games = {};

function handlePlayerJoin() {
  // TODO
  // NOTE: check if player is already in a game
}

export default function controller(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join", ({ userId, gameId }, callback) => {
      if (!games[gameId]) {
        const firstPlayer = { userId, socket };
        games[gameId] = new Game({ io, firstPlayer });
        socket.join(gameId);
      } else {
        const res = games[gameId].addPlayer({
          userId,
          socket,
        });

        if (res) {
          games[gameId].start();
          socket.join(gameId);
        } else {
          callback({ message: "game full" });
        }
      }

      console.log(games);
    });

    socket.on("move", ({ move, gameId, userId }, callback) => {
      games[gameId].makeMove({ move, userId });
    });

    socket.on("disconnect", () => {
      // TODO
    });
  });

  return io;
}
