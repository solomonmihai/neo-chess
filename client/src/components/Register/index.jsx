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
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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
          register
        </Text>
        <FormLabel>email</FormLabel>
        <Input value={data.email} onChange={(e) => onInputChange(e, "email")} />
        <FormLabel>username</FormLabel>
        <Input
          value={data.username}
          onChange={(e) => onInputChange(e, "username")}
        />
        <FormLabel>password</FormLabel>
        <PasswordInput
          type="password"
          value={data.password}
          onChange={(e) => onInputChange(e, "password")}
        />
        <FormLabel>confirm password</FormLabel>
        <PasswordInput
          type="password"
          value={data.confirmPassword}
          onChange={(e) => onInputChange(e, "confirmPassword")}
        />
        <Button w="full" mt="4" onClick={register}>
          create account
        </Button>

        <Text textAlign="center" color="gray.400" mt="2">
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
      </FormControl>
    </Box>
  );
}
