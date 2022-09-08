const games = {};

class Player {
  constructor(name, color, id, gameID) {
    this.name = name;
    this.color = color;
    this.id = id;
    this.gameID = gameID;
  }
}

function game(id) {
  return games[id];
}

function addPlayer({ gameID, name, id }) {
  if (!games[gameID]) {
    const color = Math.random() < 0.5 ? "w" : "b";
    const player = new Player(name, color, id, gameID);
    games[gameID] = [player];

    return {
      message: "joined successfully",
      opponent: null,
      player,
    };
  }

  if (games[gameID].length >= 2) {
    return {
      error: "game full",
    };
  }

  const opponent = games[gameID][0];
  const color = opponent.color == "w" ? "b" : "w";
  const player = new Player(name, color, id, gameID);
  games[gameID].push(player);

  return {
    message: "added successfully",
    opponent,
    player,
  };
}

function removePlayer(id) {
  for (const game in games) {
    const players = games[game];
    const index = players.findIndex((p) => p.id == id);

    if (index != -1) {
      return players.splice(index, 1)[0];
    }
  }
}

module.exports = {
  addPlayer,
  game,
  removePlayer,
};
