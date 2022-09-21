import { Chess } from "chess.js";
import { nanoid } from "nanoid";

export default class Game {
  constructor() {
    this.id = nanoid(10);
    this.chessInstance = new Chess();
    this.players = [];
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

    console.log(`[x] player ${player.userId} joined game ${this.id}`);

    this.players.push(player);
    player.socket.join(this.id);

    if (this.players.length == 2) {
      this.start();
    }

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
    player.socket.to(this.id).emit("opponent-reconnected");
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
    const board = this.chessInstance.board();
    this.players.forEach((p) => p.socket.emit("board", { board }));
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
