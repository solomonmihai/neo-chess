import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/Game";

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
