import { Container, Box } from "@chakra-ui/react";
import Board from "../components/Board";

export default function Game() {
  return (
    <Container display="flex" justifyContent="center">
      <Board />
    </Container>
  );
}
