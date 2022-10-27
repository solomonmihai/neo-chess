import { Box, Text } from "@chakra-ui/react";
import LinkText from "../../components/LinkText";

function parseMessage(message, color) {
  if (message.state == "checkmate") {
    if (message.color == color) {
      return "you won!";
    }
    return "you lost!";
  }

  if (message.state == "draw") {
    return "draw!";
  }
}

// TODO
export default function EndStateBanner({ message, color, user, opponent }) {
  const title = parseMessage(message, color);

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0, 0, 0, 0.3)"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box p="4" borderRadius="lg" backgroundColor="gray.800" display="flex" flexDir="column" textAlign="center">
        <Text>{title}</Text>
        <LinkText to="/home" text="go back" />
      </Box>
    </Box>
  );
}
