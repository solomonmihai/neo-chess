import { Box } from "@chakra-ui/react";

const Square = ({ isBlack }) => (
  <Box boxSize="70px" borderRadius="4px" bg={isBlack ? "blue.800" : "gray.100"}></Box>
);

export default function Board() {

  const playingAsWhite = true;

  const columns = [1, 2, 3, 4, 5, 6, 7, 8];
  const rows = columns.map((c, i) =>
    String.fromCharCode("A".charCodeAt(0) + i)
  );

  return (
    <Box>
      {rows.map((_, row) => (
        <Box key={row} display="flex" flexDir="row">
          {columns.map((__, col) => (
            <Square key={col} isBlack={(row + col) % 2 == !playingAsWhite}></Square>
          ))}
        </Box>
      ))}
    </Box>
  );
}
