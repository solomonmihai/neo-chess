import { useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

import Square from "./Square";
import Piece from "./Piece";
import { useEffect } from "react";

// TODO: draw arrows, highlight squares feature

function getSquarePos(i1, i2, isBlack) {
  const file = String.fromCharCode("a".charCodeAt(0) + (isBlack ? 7 - i2 : i2));
  const rank = isBlack ? 7 - i1 : i1;
  return `${file}${8 - rank}`;
}

function emptyBoard() {
  const board = [];

  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) {
      row.push(null);
    }
    board.push(row);
  }

  return board;
}

const EMPTY_BOARD = emptyBoard();

export default function Board({ board = EMPTY_BOARD, isBlack = false, sendMove }) {
  const [lastMove, setLastMove] = useState();

  // TODO fix board flip
  if (isBlack) {
    board = board.reverse();
    board.map((row) => row.reverse());
  }

  const moveStart = useRef();
  function setMoveStart(pos) {
    moveStart.current = pos;
  }

  function makeMove(pos) {
    const from = moveStart.current;
    const to = pos;
    const move = { from, to };
    // setLastMove(move);
    sendMove(move);
  }

  // TODO: make board resizable
  // TODO: show notations
  // TODO: fix last move highlight

  return (
    <Box userSelect="none">
      {board.map((row, i1) => (
        <Box key={i1} display="flex">
          {row.map((cell, i2) => {
            const pos = getSquarePos(i1, i2, isBlack);

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
                isBlack={(i1 + i2) % 2 == isBlack}
                highlight={highlight}
                moveOnMe={() => {
                  makeMove(pos);
                }}
              >
                {cell && <Piece type={cell.type} color={cell.color} setAsMoveStart={() => setMoveStart(pos)} />}
              </Square>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
