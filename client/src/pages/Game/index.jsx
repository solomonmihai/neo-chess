import { Flex, Box, Text } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

import AuthStore from "../../stores/AuthStore";
import Board from "./Board";
import UserBanner from "./UserBanner";

export default function Game() {
  const user = AuthStore.useState((s) => s.user);
  const socket = useRef();

  const [board, setBoard] = useState();
  const [color, setColor] = useState();

  const [opponent, setOpponent] = useState();

  // NOTE: check how to store gameId

  useEffect(() => {
    socket.current = io("localhost:3000");

    socket.current.emit("join", { gameId: 1234, userId: user.id }, ({ message }) => {
      console.log(message);
    });

    socket.current.on("player-data", ({ color, opponentId }) => {
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

    socket.current.on("opponent-disconnected", () => {
      // TODO: opponent reconnected
      console.log("[x] opponent disconnected");
    });

    socket.current.on("board", ({ board }) => {
      setBoard(board);
    });
  }, []);

  function sendMove(move) {
    socket.current.emit("move", { move, gameId: 1234, userId: user.id });
  }

  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      {opponent && <UserBanner user={opponent} />}
      <Board board={board} isBlack={color == "b"} sendMove={sendMove} />
      <UserBanner user={user} />
    </Flex>
  );
}
