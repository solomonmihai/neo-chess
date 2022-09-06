import { useRef, useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Box } from "@chakra-ui/react";

import Square from "./Square";
import Piece from "./Piece";

function getSquarePos(i1, i2) {
  const file = String.fromCharCode("a".charCodeAt(0) + i2);
  return `${file}${8 - i1}`;
}

export default function Board() {
  const chess = useRef(new Chess());
  const [board, setBoard] = useState(chess.current.board());
  const [move, setMove] = useState();

  const playingAsWhite = true;

  const moveStart = useRef();
  function setMoveStart(pos) {
    moveStart.current = pos;
  }
  function makeMove(pos) {
    setMove(
      chess.current.move({
        from: moveStart.current,
        to: pos,
      })
    );
    setBoard(chess.current.board());
  }

  return (
    <Box userSelect="none">
      {board.map((row, i1) => (
        <Box key={i1} display="flex">
          {row.map((cell, i2) => {
            const pos = getSquarePos(i1, i2);
            const highlight = move && (move.from == pos || move.to == pos);
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
