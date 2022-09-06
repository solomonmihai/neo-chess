import { Box } from "@chakra-ui/react";

export default function Square({ isBlack, moveOnMe, highlight, children }) {
  function onDrop() {
    moveOnMe();
  }

  let color = isBlack ? "blue.700" : "gray.100";
  if (highlight) {
    color = "blue.300";
  }

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
