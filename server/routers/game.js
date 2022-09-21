import { Router } from "express";

import verifyToken from "../middleware/auth.js";
import Game from "../sockets/gameManager.js";
import { games } from "../game/games.js";

const GameRouter = Router();

GameRouter.get("/new", verifyToken, (req, res) => {
  const game = new Game();

  const { id } = game;
  games[id] = game;

  return res.send({ id });
});

GameRouter.get("/live", (req, res) => {});

export default GameRouter;
