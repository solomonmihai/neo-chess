import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/Game";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";

// NOTE: useToken() hook

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
