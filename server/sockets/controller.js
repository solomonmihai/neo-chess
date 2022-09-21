import { Server } from "socket.io";
import Player from "./player.js";

import { games, userIsInGame, socketIsInGame } from "../game/games.js";

function handlePlayerJoin({ socket, callback, userId, gameId }) {
  const { game } = userIsInGame(userId);
  if (game) {
    if (game.id == gameId) {
      game.reconnectPlayer({ userId, socket });
    } else {
      callback({ message: "player is in another game" });
    }
    return;
  }

  if (!games[gameId]) {
    callback({ message: "game non existent" });
    return;
  }

  const player = new Player({ userId, socket });

  if (!games[gameId].addPlayer(player)) {
    callback({ message: "cannot join this game" });
  }
}

export default function controller(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join", ({ userId, gameId }, callback) => {
      handlePlayerJoin({ socket, callback, userId, gameId });
    });

    socket.on("move", ({ move, gameId, userId }) => {
      games[gameId].makeMove({ move, userId });
    });

    socket.on("disconnect", () => {
      const { game, player } = socketIsInGame(socket.id);
      if (game) {
        game.disconnectPlayer(player.socket.id);
      }
    });
  });

  return io;
}
