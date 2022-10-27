import { Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function LinkText({ to, text }) {
  return (
    <Link to={to}>
      <Text as="span" color="purple.200" textDecor="underline" cursor="pointer">
        {text}
      </Text>
    </Link>
  );
}
