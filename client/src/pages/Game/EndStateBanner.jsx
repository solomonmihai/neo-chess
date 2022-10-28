import { Box, Text, HStack } from "@chakra-ui/react";
import LinkText from "../../components/LinkText";

function parseMessage(message, color) {
  if (message.state == "checkmate" || message.state == "resign") {
    if (message.winner == color) {
      return "you won!";
    }
    return "you lost!";
  }

  if (message.state == "draw") {
    return "draw!";
  }
}

// TODO
// NOTE: place this in the middle of the board
export default function EndStateBanner({ message, color, user, opponent }) {
  const title = parseMessage(message, color);

  return (
    <Box
      p="4"
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      borderRadius="lg"
      backgroundColor="gray.800"
      display="flex"
      flexDir="column"
      textAlign="center"
    >
      <Text>{title}</Text>
      <HStack fontWeight="bold" textAlign="center">
        <Text>{user.username}</Text>
        <Text>{opponent.username}</Text>
      </HStack>
      <LinkText to="/home" text="go back" />
    </Box>
  );
}
