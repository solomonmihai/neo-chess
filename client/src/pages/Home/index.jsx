import { Box, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AuthStore from "../../stores/AuthStore";

export default function Home() {
  const user = AuthStore.useState((s) => s.user);

  const navigate = useNavigate();

  function createGame() {
    axios
      .get("/game/new")
      .then((res) => {
        const { id } = res.data;

        navigate(`/game/${id}`);
      })
      .catch((err) => {
        console.log("error creating game", err);
      });
  }

  return (
    <Box>
      <Text>logged in as {user.username}</Text>
      <Button onClick={createGame}>create game</Button>
    </Box>
  );
}
