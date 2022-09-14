import axios from "axios";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AuthStore from "./stores/AuthStore";
import { checkToken } from "./util/auth";

export default function App() {

  useEffect(() => {
    AuthStore.subscribe(
      (s) => s,
      ({ token }) => {
        console.log("app subscribe");
        if (!token) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["x-access-token"];
          return;
        }

        localStorage.setItem("token", token);

        axios.defaults.headers.common["x-access-token"] = token;
      }
    );

    checkToken();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
