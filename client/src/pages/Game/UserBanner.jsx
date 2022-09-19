import { Box, Text } from "@chakra-ui/react";

export default function UserBanner({ user }) {
  return (
    <Box p="2" borderRadius="lg" borderWidth="1px" borderColor="purple.200">
      <Text>{user.username}</Text>
    </Box>
  );
}
