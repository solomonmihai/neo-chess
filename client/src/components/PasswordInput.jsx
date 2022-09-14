import { useState } from "react";
import {
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

export default function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
      />
      <InputRightElement>
        <IconButton
          tabIndex={-1}
          variant="ghost"
          icon={show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          onMouseDown={() => setShow(true)}
          onMouseUp={() => setShow(false)}
          onMouseLeave={() => setShow(false)}
        />
      </InputRightElement>
    </InputGroup>
  );
}
