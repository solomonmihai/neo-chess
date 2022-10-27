import { Server } from "socket.io";
import Player from "./player.js";

import { getGame, userIsInGame, socketIsInGame } from "../game/games.js";

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

  if (!getGame(gameId)) {
    callback({ message: "no-game" });
    return;
  }

  const player = new Player({ userId, socket });

  if (getGame(gameId).addPlayer(player)) {
    callback({ message: "cannot join this game" });
  }
}

let io;

export default function controller(server) {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join", ({ userId, gameId }, callback) => {
      handlePlayerJoin({ socket, callback, userId, gameId });
    });

    socket.on("move", ({ move, gameId, userId }) => {
      // TODO: check if game id exists
      const game = getGame(gameId);
      if (!game) {
        socket.emit(`game ${gameId} does not exist`);
        return;
      }
      game.makeMove({ move, userId });
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

export function emitOpenGamesListUpdate() {
  // TODO: find a way to remove the timeout
  setTimeout(() => {
    io.emit("open-games-update");
  }, 1000);
}
