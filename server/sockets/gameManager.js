import { Chess } from "chess.js";
import { customAlphabet } from "nanoid";
import { finishGame } from "../game/games.js";
import { emitOpenGamesListUpdate } from "./controller.js";

const nanoid = customAlphabet("abcdefghihjklmnopqrstuvxywz", 5);

const DEBUG = true;

const BOTH_DISCONNECT_TIMEOUT = 10 * 1000;
const DISCONNECT_TIMEOUT = 10 * 1000;

function log(...info) {
  if (!DEBUG) {
    return;
  }
  console.log("[x] game manager:", ...info);
}

export default class Game {
  constructor() {
    this.id = nanoid();
    this.chessInstance = new Chess();
    this.players = [];
    this.started = false;

    this.whiteId = null;
    this.blackId = null;

    this.createdAt = Date.now();
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

    log(`player ${player.userId} joined game ${this.id}`);

    this.players.push(player);
    player.socket.join(this.id);

    if (this.players.length == 1) {
      this.players[0].color = Math.random() < 0.5 ? "w" : "b";
    }

    if (this.players.length == 2) {
      this.start();
    }

    return true;
  }

  getOtherPlayer(player) {
    return this.players.find((p) => p.userId != player.userId);
  }

  getDisconnectedPlayers() {
    return this.players.reduce((p, sum) => (sum += p.diconnected ? 1 : 0));
  }

  disconnectPlayer(socketId) {
    const player = this.players.find((p) => p.socket.id == socketId);

    player.socket.to(this.id).emit("opponent-disconnected");
    player.disconnected = true;

    player.disconnectTimeoutId = setTimeout(() => {
      // TODO: set the other player as winner
      this.endGame();
    }, DISCONNECT_TIMEOUT);

    log(`player ${player.userId} disconnected from game ${this.id}`);

    if (this.getDisconnectedPlayers() == this.players.length) {
      this.bothDisconnectedTimeoutId = setTimeout(() => {
        if (this.getDisconnectedPlayers() == this.players.length) {
          this.endGame();
        }
      }, BOTH_DISCONNECT_TIMEOUT);
    }
  }

  reconnectPlayer({ userId, socket }) {
    const player = this.players.find((p) => p.userId == userId);
    player.socket = socket;
    player.socket.join(this.id);

    player.disconnected = false;
    clearTimeout(player.disconnectTimeoutId);

    if (this.started) {
      player.socket.to(this.id).emit("opponent-reconnected");
      player.socket.emit("player-data", {
        color: player.color,
        opponentId: this.getOtherPlayer(player).userId,
      });

      player.socket.emit("board", { board: this.chessInstance.board() });
    }

    log(`player ${player.userId} reconnected to game ${this.id}`);

    if (this.getDisconnectedPlayers() == 0) {
      clearTimeout(this.bothDisconnectedTimeoutId);
    }
  }

  start() {
    this.players[1].color = this.players[0].color == "w" ? "b" : "w";

    if (this.players[0].color == "w") {
      this.whiteId = this.players[0].userId;
      this.blackId = this.players[1].userId;
    } else {
      this.whiteId = this.players[1].userId;
      this.blackId = this.players[0].userId;
    }

    this.players.forEach((p) => {
      p.socket.emit("player-data", {
        color: p.color,
        opponentId: this.getOtherPlayer(p).userId,
      });
    });

    this.sendBoard();

    this.started = true;

    emitOpenGamesListUpdate();
  }

  sendBoard() {
    const board = this.chessInstance.board();
    this.players.forEach((p) => p.socket.emit("board", { board }));
  }

  getPlayer(id) {
    return this.players.find((p) => p.userId == id);
  }

  addHeaders() {
    this.chessInstance.header("white", this.whiteId);
    this.chessInstance.header("black", this.blackId);
    this.chessInstance.header("date", Date.now());
  }

  makeMove({ move, userId }) {
    const ci = this.chessInstance;

    if (this.getPlayer(userId).color != ci.turn()) {
      return;
    }
    ci.move(move);
    this.sendBoard();

    if (ci.isGameOver()) {
      const message = { state: null };

      if (ci.isCheckmate()) {
        message.state = "checkmate";
        message["winner"] = ci.turn() == "w" ? "b" : "w";
      }

      if (ci.isDraw()) {
        message.state = "draw";
      }

      if (ci.isStalemate()) {
        message.state = "stalemate";
      }

      if (ci.isThreefoldRepetition()) {
        message.state = "repetition";
      }

      if (ci.isInsufficientMaterial()) {
        message.state = "insufficient_material";
      }

      this.players.forEach((p) => p.socket.emit("end", { message }));
    }
  }

  endGame() {
    finishGame(this.id);
  }
}
