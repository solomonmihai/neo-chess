import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import Nav from "./components/Nav";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AuthStore from "./stores/AuthStore";
import { checkToken } from "./util/auth";
import { Box, Text } from "@chakra-ui/react";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthStore.subscribe(
      (s) => s.token,
      (token) => {
        if (!token) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["x-access-token"];
          return;
        }

        localStorage.setItem("token", token);

        axios.defaults.headers.common["x-access-token"] = token;
      }
    );

    checkToken().then(() => {
      setLoading(false);
    });
  }, []);

  // TODO: refactor this
  if (loading) {
    return (
      <Box>
        <Text fontWeight="bold" textAlign="center">
          loading ...
        </Text>
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <>
              <Nav />
              <Outlet />
            </>
          }
        >
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/game/:id" element={<Game />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
