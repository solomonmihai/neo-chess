import { Box, Button, Text } from "@chakra-ui/react";
import AuthStore from "../../stores/AuthStore";
import { logOut } from "../../util/auth";

export default function Home() {
  const user = AuthStore.useState((s) => s.user);

  return (
    <Box>
      <Text>logged in as {user.username}</Text>
      <Button onClick={logOut}>logout</Button>
    </Box>
  );
}
