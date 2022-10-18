import { Flex } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import AuthStore from "../../stores/AuthStore";
import Board from "./Board";
import UserBanner from "./UserBanner";
import GameStore from "../../stores/GameStore";

export default function Game() {
  const gameId = useParams().id;

  const user = AuthStore.useState((s) => s.user);

  const socket = GameStore.useState((s) => s.socket);

  const [board, setBoard] = useState();
  const [color, setColor] = useState();

  const [opponent, setOpponent] = useState();

  useEffect(() => {
    socket.emit("join", { gameId, userId: user.id }, ({ message }) => {
      console.log(message);
      // TODO: show something if game non existent
    });

    socket.on("player-data", ({ color, opponentId }) => {
      setColor(color);

      axios
        .get(`/user/${opponentId}`)
        .then((res) => {
          setOpponent(res.data.user);
        })
        .catch((err) => {
          console.log("error getting opponent", err);
        });
    });

    socket.on("opponent-disconnected", () => {
      console.log("[x] opponent disconnected");
    });

    socket.on("opponent-reconnected", () => {
      console.log("[x] opponent reconnected");
    });

    socket.on("board", ({ board }) => {
      setBoard(board);
    });

    socket.on("end", ({ message }) => {
      console.log(message);
      // TODO: display feedback
    });
  }, []);

  function sendMove(move) {
    socket.emit("move", { move, gameId, userId: user.id });
  }

  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      {opponent && <UserBanner user={opponent} />}
      <Board board={board} isBlack={color == "b"} sendMove={sendMove} />
      <UserBanner user={user} />
    </Flex>
  );
}
