import { Schema, model } from "mongoose";

const gameSchema = Schema({
  pgn: {
    type: String,
    required: true,
  },
  white: {
    // type id
  }
  // add timestamps
});

const Game = model("User", gameSchema);

export default Game;
