import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Box } from "@chakra-ui/react";
import io from "socket.io-client";

import Square from "./Square";
import Piece from "./Piece";

const socket = io("localhost:3000");

function getSquarePos(i1, i2) {
  const file = String.fromCharCode("a".charCodeAt(0) + i2);
  return `${file}${8 - i1}`;
}

export default function Board() {
  const chess = useRef(new Chess());
  const [board, setBoard] = useState(chess.current.board());
  const [lastMove, setLastMove] = useState();

  const playingAsWhite = true;

  const moveStart = useRef();
  function setMoveStart(pos) {
    moveStart.current = pos;
  }

  function makeMove(pos) {
    const from = moveStart.current;
    const to = pos;
    const move = chess.current.move({
      from,
      to,
    });
    // TODO: check promotion
    if (move) {
      setLastMove(move);
    }
    setBoard(chess.current.board());
    socket.emit("move", { gameId: 20, from, to });
  }

  useEffect(() => {
    socket.emit("join", { name: "Mihai", gameId: 20 }, ({ error, color }) => {
      console.log({ color });
    });

    socket.on("welcome", ({ message, opponent }) => {
      console.log({ message, opponent });
    });

    socket.on("opponentJoin", ({ message, opponent }) => {
      console.log({ message, opponent });
    });

    socket.on("opponentMove", ({ from, to }) => {
      const move = chess.current.move({
        from,
        to,
      });
      if (move) {
        setLastMove(move);
      }
      setBoard(chess.current.board());
    });

    socket.on("message", ({ message }) => {
      console.log({ message });
    });
  }, []);

  return (
    <Box userSelect="none">
      {board.map((row, i1) => (
        <Box key={i1} display="flex">
          {row.map((cell, i2) => {
            const pos = getSquarePos(i1, i2);

            // choose highlight color
            let highlight = null;
            if (lastMove) {
              if (lastMove.from == pos) {
                highlight = "blue.200";
              } else if (lastMove.to == pos) {
                highlight = "blue.400";
              }
            }

            return (
              <Square
                key={i2}
                isBlack={(i1 + i2) % 2 == !playingAsWhite}
                highlight={highlight}
                moveOnMe={() => {
                  makeMove(pos);
                }}
              >
                {cell && (
                  <Piece
                    type={cell.type}
                    color={cell.color}
                    setAsMoveStart={() => setMoveStart(pos)}
                  />
                )}
              </Square>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
