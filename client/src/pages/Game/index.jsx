import { Flex, Box, Text, Button, Spacer } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import AuthStore from "../../stores/AuthStore";
import Board from "./Board";
import GameStore from "../../stores/GameStore";
import LinkText from "../../components/LinkText";
import EndStateBanner from "./EndStateBanner";

export default function Game() {
  const gameId = useParams().id;

  const user = AuthStore.useState((s) => s.user);

  const socket = GameStore.useState((s) => s.socket);

  const [board, setBoard] = useState();
  const [color, setColor] = useState();

  const [opponent, setOpponent] = useState();
  const [noGame, setNoGame] = useState(false);
  const [endMessage, setEndMessage] = useState(null);
  const [proposingDraw, setProposingDraw] = useState(false);
  const [drawProposal, setDrawProposal] = useState(false);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit("join", { gameId, userId: user.id }, ({ message }) => {
      if (message == "no-game") {
        setNoGame(true);
      }
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

    socket.on("draw-proposal", () => {
      setDrawProposal(true);
    });

    socket.on("draw-declined", () => {
      setDrawProposal(false);
      setProposingDraw(false);
    });

    socket.on("end", ({ message }) => {
      console.log(message);
      setDrawProposal(false);
      setEndMessage(message);
    });
  }, [socket]);

  function sendMove(move) {
    socket.emit("move", { move });
  }

  function resign() {
    socket.emit("resign");
  }

  function proposeDraw() {
    setProposingDraw(true);
    socket.emit("propose-draw");
  }

  function acceptDraw() {
    socket.emit("accept-draw");
  }

  function declineDraw() {
    socket.emit("decline-draw");
  }

  if (noGame) {
    return (
      <Box width="full" height="full" display="flex" flexDir="column" justifyContent="center" alignItems="center">
        <Text to="/home" as="p">
          game non existent
        </Text>
        <LinkText to="/home" text="go back home" />
      </Box>
    );
  }

  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex direction="column">
        {opponent && (
          <Flex dir="row" width="full" alignItems="center" my="2">
            <Text fontWeight="bold">{opponent.username}</Text>
            <Spacer />
            {drawProposal && (
              <>
                <Text fontWeight="bold" mr="2">
                  proposed a draw
                </Text>
                <Button variant="ghost" colorScheme="red" onClick={declineDraw}>
                  decline
                </Button>
                <Button variant="ghost" onClick={acceptDraw}>
                  accept
                </Button>
              </>
            )}
          </Flex>
        )}
        <Board board={board} isBlack={color == "b"} sendMove={sendMove} />
        <Flex dir="row" width="full" alignItems="center" my="2">
          <Text fontWeight="bold">{user.username}</Text>
          <Spacer />
          {proposingDraw && <Text fontWeight="bold">draw offer sent</Text>}
          {opponent && !endMessage && !proposingDraw && !drawProposal && (
            <>
              <Button variant="ghost" onClick={proposeDraw}>
                draw
              </Button>
              <Button variant="ghost" colorScheme="red" onClick={resign}>
                resign
              </Button>
            </>
          )}
        </Flex>
        {endMessage && <EndStateBanner message={endMessage} color={color} user={user} opponent={opponent} />}
      </Flex>
    </Flex>
  );
}
