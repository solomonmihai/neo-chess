import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import PasswordInput from "../general/PasswordInput";

export default function Register() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  function onInputChange(e, key) {
    setData((old) => {
      const newData = { ...old };
      newData[key] = e.target.value;
      return newData;
    });
  }

  function register() {
    console.log(data);
  }

  return (
    <Box w="full" display="flex" justifyContent="center" alignItems="center">
      <FormControl maxW="400px" mt="70px">
        <Text textAlign="center" fontWeight="bold" fontSize="2em">
          login
        </Text>
        <FormLabel>username</FormLabel>
        <Input onChange={(e) => onInputChange(e, "username")} />
        <FormLabel>password</FormLabel>
        <PasswordInput
          type="password"
          value={data.password}
          onChange={(e) => onInputChange(e, "password")}
        />
        <Button w="full" mt="4" onClick={register}>
          login
        </Button>

        <Text textAlign="center" color="gray.400" mt="2">
          don't have an account?{" "}
          <Link to="/register">
            <Text
              as="span"
              color="purple.200"
              textDecor="underline"
              cursor="pointer"
            >
              register
            </Text>
          </Link>
        </Text>
      </FormControl>
    </Box>
  );
}
