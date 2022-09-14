import { Box, Image } from "@chakra-ui/react";
import { useState } from "react";

import images from "./images";

export default function Piece({ type, color, setAsMoveStart }) {
  const [show, setShow] = useState(true);

  function dragStart() {
    // TODO: show piece with center on mouse coordinates instead of this
    setAsMoveStart();
    setTimeout(() => {
      setShow(false);
    }, 0);
  }

  function dragEnd() {
    setShow(true);
  }

  // TODO: show somewhere that the chess set is from lichess

  return (
    <Box
      w="full"
      h="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      cursor="pointer"
      hidden={!show}
      draggable={true}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      padding="1"
    >
      <Image src={images[`${color}${type}`]} w="full" h="auto" />
    </Box>
  );
}
