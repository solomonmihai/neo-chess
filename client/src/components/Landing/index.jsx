import { Text, Box, Button, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <Box mt="10%">
      <Heading textAlign="center">welcome to neo-chess</Heading>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt="6"
        mb="2"
      >
        <Link to="register">
          <Button mx="2" w="200px">
            create an account
          </Button>
        </Link>
        <Button mx="2" w="200px" variant="outline">
          play as guest
        </Button>
      </Box>
      <Box w="full">
        <Text textAlign="center" color="gray.400">
          already have an account?{" "}
          <Link to="/login">
            <Text
              as="span"
              color="purple.200"
              textDecor="underline"
              cursor="pointer"
            >
              login
            </Text>
          </Link>
        </Text>
      </Box>
    </Box>
  );
}
