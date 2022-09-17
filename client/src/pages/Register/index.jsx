import { useState } from "react";
import { Box, Button, FormControl, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import InputList from "../../components/InputList";
import AuthStore from "../../stores/AuthStore";
import { useEffect } from "react";

export default function Register() {
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const user = AuthStore.useState((s) => s.user);
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  function register() {
    axios
      .post("/auth/register", data)
      .then((res) => {
        const { token, user } = res.data;
        AuthStore.update((s) => {
          s.token = token;
          s.user = user;
        });

        navigate("/home");
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  }

  const inputs = [
    {
      name: "email",
      isPassword: false,
    },
    {
      name: "username",
      isPassword: false,
    },
    {
      name: "password",
      isPassword: true,
    },
    {
      name: "confirmPassword",
      isPassword: true,
    },
  ];

  return (
    <Box w="full" display="flex" justifyContent="center" alignItems="center">
      <FormControl maxW="400px" mt="70px">
        <Text textAlign="center" fontWeight="bold" fontSize="2em">
          register
        </Text>

        <InputList
          inputs={inputs}
          data={data}
          errors={errors}
          setData={setData}
          setErrors={setErrors}
          onSubmit={register}
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
