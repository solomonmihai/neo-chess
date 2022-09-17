import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

export default class Game {
  constructor({ io, firstPlayer }) {
    this.io = io;
    // this.id = uuid();
    this.id = 1234;
    this.chessInstance = new Chess();
    this.players = [firstPlayer];
  }

  addPlayer(player) {
    if (this.players.length >= 2) {
      return false;
    }

    for (const { userId } of this.players) {
      if (userId == player.userId) {
        return false;
      }
    }

    this.players.push(player);
    return true;
  }

  removePlayer(socketId) {
    // TODO
  }

  start() {
    if (Math.random() < 0.5) {
      this.players[0].color = "w";
      this.players[1].color = "b";
    } else {
      this.players[0].color = "w";
      this.players[1].color = "b";
    }

    this.players.forEach((p) => {
      p.socket.emit("set-color", { color: p.color });
    });

    this.sendBoard();
  }

  sendBoard() {
    this.io.to(this.id).emit("board", { board: this.chessInstance.board() });
  }

  getPlayerColor(id) {
    return this.players.find((p) => p.userId == id).color;
  }

  makeMove({ move, userId }) {
    if (this.getPlayerColor(userId) != this.chessInstance.turn()) {
      return;
    }
    this.chessInstance.move(move);
    this.sendBoard();
  }
}
