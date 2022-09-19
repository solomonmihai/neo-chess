export const games = {};

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