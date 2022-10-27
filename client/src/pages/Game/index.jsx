import { Flex, Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import AuthStore from "../../stores/AuthStore";
import Board from "./Board";
import UserBanner from "./UserBanner";
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

    socket.on("end", ({ message }) => {
      console.log(message);
      setEndMessage(message);
    });
  }, [socket]);

  function sendMove(move) {
    socket.emit("move", { move, gameId, userId: user.id });
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
    <Flex direction="column" alignItems="center" justifyContent="center">
      {opponent && <UserBanner user={opponent} />}
      <Board board={board} isBlack={color == "b"} sendMove={sendMove} />
      <UserBanner user={user} />
      {endMessage && <EndStateBanner message={endMessage} color={color} />}
    </Flex>
  );
}
