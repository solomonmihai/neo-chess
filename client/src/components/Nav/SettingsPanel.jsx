import {
  VStack,
  IconButton,
  Button,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../../util/auth";

export default function SettingsPanel() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef();

  useOutsideClick({
    ref: panelRef,
    handler: (e) => {
      if (e.target.name != "settings-button") {
        setIsOpen(false);
      }
    },
  });

  function logout() {
    logoutUser();
    navigate("/");
  }

  return (
    <>
      <IconButton
        name="settings-button"
        variant="outline"
        icon={<AiFillSetting pointerEvents="none" />}
        onClick={() => setIsOpen((old) => !old)}
      />
      {isOpen && (
        <VStack
          ref={panelRef}
          position="fixed"
          right="10px"
          top="50px"
          width="150px"
          p="2"
          backgroundColor="gray.900"
          borderRadius="lg"
          borderColor="purple.200"
          borderWidth="1px"
        >
          <Button w="full" variant="ghost">
            view profile
          </Button>
          <Button w="full" variant="ghost" onClick={logout}>
            logout
          </Button>
        </VStack>
      )}
    </>
  );
}
