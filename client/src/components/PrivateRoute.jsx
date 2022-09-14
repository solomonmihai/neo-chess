import { Box, Text } from "@chakra-ui/react";
import AuthStore from "../stores/AuthStore";

export default function PrivateRoute({ children }) {
  const token = AuthStore.useState((s) => s.token);

  if (!token) {
    return (
      <Box>
        <Text>you are not authenticated</Text>
      </Box>
    );
  }

  return children;
}
