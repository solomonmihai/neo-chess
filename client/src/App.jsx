import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Game from "./pages/Game";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Hello w</h1>} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
