import { Router } from "express";

import verifyToken from "../middleware/auth.js";
import { createGame, getAllGames } from "../game/games.js";

const GamesRouter = Router();

GamesRouter.get("/new", verifyToken, (_, res) => {
  const id = createGame();
  return res.send({ id });
});

GamesRouter.get("/open", async (_, res) => {
  const games = Object.values(getAllGames())
    .filter((game) => !game.started && game.players.length == 1)
    .map((game) => ({
      id: game.id,
      userId: game.players[0].userId,
      color: game.players[0].color == "w" ? "w" : "b",
      createdAt: game.createdAt,
    }));

  return res.send({ games });
});

export default GamesRouter;
