import { Container, Box, Text } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

import AuthStore from "../../stores/AuthStore";
import Board from "./Board";

export default function Game() {
  const user = AuthStore.useState((s) => s.user);
  const socket = useRef();
  // empty board
  const [board, setBoard] = useState();
  const [color, setColor] = useState();

  // NOTE: check how to store gameId

  useEffect(() => {
    socket.current = io("localhost:3000");

    socket.current.emit(
      "join",
      { gameId: 1234, userId: user.id },
      ({ message }) => {
        console.log(message);
      }
    );

    socket.current.on("set-color", ({ color }) => {
      setColor(color);
    });

    socket.current.on("board", ({ board }) => {
      setBoard(board);
      console.log('getting board', board)
    });
  }, []);

  function sendMove(move) {
    socket.current.emit(
      "move",
      { move, gameId: 1234, userId: user.id },
      ({ board }) => {
        setBoard(board);
      }
    );
  }

  return (
    <Container display="flex" justifyContent="center">
      <Board board={board} isBlack={color == "b"} sendMove={sendMove} />
    </Container>
  );
}
