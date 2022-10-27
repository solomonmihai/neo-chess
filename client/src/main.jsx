import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";

import { ChakraProvider } from "@chakra-ui/react";

import theme from "./theme";

axios.defaults.baseURL = "http://localhost:3000/"
// axios.defaults.baseURL = "http://192.168.100.145:5173/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
