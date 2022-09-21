import { Box } from "@chakra-ui/react";

export default function Square({ isBlack, moveOnMe, highlight, children }) {
  function onDrop() {
    moveOnMe();
  }

  const color = highlight || (isBlack ? "green.500" : "gray.100");

  return (
    <Box
      boxSize="70px"
      bg={color}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {children}
    </Box>
  );
}
