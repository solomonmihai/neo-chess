import { emitOpenGamesListUpdate } from "../sockets/controller.js";
import Game from "../sockets/gameManager.js";

const games = {};

export function getGame(id) {
  if (games[id]) {
    return games[id];
  }

  return false;
}

export function getAllGames() {
  return games;
}

export function userIsInGame(userId) {
  for (const game of Object.values(games)) {
    for (const player of game.players) {
      if (userId == player.userId) {
        return { player, game };
      }
    }
  }

  return { player: null, game: null };
}

// TODO: combine these 2 functions
export function socketIsInGame(socketId) {
  for (const game of Object.values(games)) {
    for (const player of game.players) {
      if (player.socket.id == socketId) {
        return { player, game };
      }
    }
  }

  return { player: null, game: null };
}

export function createGame() {
  const game = new Game();

  const { id } = game;
  games[id] = game;

  emitOpenGamesListUpdate();

  return id;
}

export function finishGame(id) {
  delete games[id];
  // TODO: if game wasn't started, don't save it to db
  emitOpenGamesListUpdate();
}
