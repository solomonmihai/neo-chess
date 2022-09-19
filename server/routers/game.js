import { Router } from "express";

import { games } from "../game/games.js";
import verifyToken from "../middleware/auth.js";

const GameRouter = Router();

GameRouter.get("/new", verifyToken, (req, res) => {});

GameRouter.get("/live", (req, res) => {});

export default GameRouter;
