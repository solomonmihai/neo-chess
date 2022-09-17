import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import AuthStore from "../../stores/AuthStore";

export default function Home() {
  const user = AuthStore.useState((s) => s.user);

  const navigate = useNavigate();

  return (
    <Box>
      <Text>logged in as {user.username}</Text>
      <Button onClick={() => navigate("/game")}>create game</Button>
    </Box>
  );
}
