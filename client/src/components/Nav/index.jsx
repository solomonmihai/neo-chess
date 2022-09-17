import { Text, Flex, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SettingsPanel from "./SettingsPanel";

export default function Nav() {
  const navigate = useNavigate();

  return (
    <Flex backgroundColor="gray.900" px="2" py="1" alignItems="center">
      <Text
        fontWeight="bold"
        color="purple.200"
        cursor='pointer'
        onClick={() => navigate("/home")}
      >
        neo-chess
      </Text>
      <Spacer />
      <SettingsPanel />
    </Flex>
  );
}
