import { Server } from "socket.io";
import Game from "./gameManager.js";
import Player from "./player.js";

import { games, userIsInGame, socketIsInGame } from "../game/games.js";

function handlePlayerJoin({ io, socket, userId, gameId }) {
  const { game } = userIsInGame(userId);
  if (game) {
    game.reconnectPlayer({ userId, socket });
    return true;
  }

  if (!games[gameId]) {
    const firstPlayer = new Player({ userId, socket });
    games[gameId] = new Game({ io, firstPlayer });
    socket.join(gameId);
    return true;
  }

  const res = games[gameId].addPlayer(
    new Player({
      userId,
      socket,
    })
  );

  return res;
}

export default function controller(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join", ({ userId, gameId }, callback) => {
      if (!handlePlayerJoin({ io, socket, userId, gameId })) {
        callback({ message: "game full" });
      }
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
