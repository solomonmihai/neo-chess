import { useState, useEffect } from "react";
import { Box, Button, FormControl, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import LinkText from "../../components/LinkText";

import InputList from "../../components/InputList";
import { loginUser } from "../../util/auth";
import AuthStore from "../../stores/AuthStore";

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const user = AuthStore.useState((s) => s.user);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  async function login() {
    const err = await loginUser(data);
    // TODO: fix offline server error
    if (err) {
      setErrors(err);
      return;
    }

    navigate("/home");
  }

  const inputs = [
    {
      name: "username",
      isPassword: false,
    },
    {
      name: "password",
      isPassword: true,
    },
  ];

  return (
    <Box w="full" display="flex" justifyContent="center" alignItems="center">
      <FormControl maxW="400px" mt="70px">
        <Text textAlign="center" fontWeight="bold" fontSize="2em">
          login
        </Text>

        <InputList
          inputs={inputs}
          data={data}
          errors={errors}
          setData={setData}
          setErrors={setErrors}
          onSubmit={login}
        />

        <Button w="full" mt="4" onClick={login}>
          login
        </Button>

        <Text textAlign="center" color="gray.400" mt="2">
          don't have an account? <LinkText to="/register" text="register" />
        </Text>
      </FormControl>
    </Box>
  );
}
