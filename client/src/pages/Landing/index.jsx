import { useEffect } from "react";
import { Text, Box, Button, Heading, Flex } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

import AuthStore from "../../stores/AuthStore";

export default function Landing() {
  const navigate = useNavigate();

  const user = AuthStore.useState((s) => s.user);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  return (
    <Box mt="10%">
      <Heading textAlign="center">welcome to neo-chess</Heading>
      <Flex justifyContent="center" alignItems="center" mt="6" mb="2">
        <Link to="register">
          <Button mx="2" w="200px">
            create an account
          </Button>
        </Link>
        <Button mx="2" w="200px" variant="outline">
          play as guest
        </Button>
      </Flex>
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
