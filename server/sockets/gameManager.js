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
    player.socket.join(this.id);
    this.start();

    return true;
  }

  getOtherPlayer(player) {
    return this.players.find((p) => p.userId != player.userId);
  }

  disconnectPlayer(socketId) {
    for (const player of this.players) {
      if (player.socket.id == socketId) {
        player.socket.to(this.id).emit("opponent-disconnected");
        player.disconnected = true;
      }
    }
  }

  reconnectPlayer({ userId, socket }) {
    const player = this.players.find((p) => p.userId == userId);

    player.disconnected = false;
    player.socket = socket;

    player.socket.join(this.id);
    player.socket.emit("player-data", {
      color: player.color,
      opponentId: this.getOtherPlayer(player).userId,
    });
    player.socket.emit("board", { board: this.chessInstance.board() });
  }

  start() {
    const c1 = Math.random() < 0.5 ? "w" : "b";
    const c2 = c1 == "w" ? "b" : "w";

    this.players[0].color = c1;
    this.players[1].color = c2;

    this.players.forEach((p) => {
      p.socket.emit("player-data", { color: p.color, opponentId: this.getOtherPlayer(p).userId });
    });

    this.sendBoard();
  }

  sendBoard() {
    this.io.to(this.id).emit("board", { board: this.chessInstance.board() });
  }

  getPlayer(id) {
    return this.players.find((p) => p.userId == id);
  }

  makeMove({ move, userId }) {
    if (this.getPlayer(userId).color != this.chessInstance.turn()) {
      return;
    }
    this.chessInstance.move(move);
    this.sendBoard();
  }
}
