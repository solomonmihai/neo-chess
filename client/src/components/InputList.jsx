import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";

export default function InputList({ inputs, data, errors, setData, setErrors }) {
  function onInputChange(e, key) {
    setData((old) => {
      const newData = { ...old };
      newData[key] = e.target.value;
      return newData;
    });
    setErrors((old) => {
      const newData = { ...old };
      newData[key] = null;
      return newData;
    });
  }

  return (
    <>
      {inputs.map(({ name, isPassword }, index) => {
        const InputElement = isPassword ? PasswordInput : Input;
        return (
          <FormControl key={index} isInvalid={errors && errors[name]}>
            <FormLabel>{name}</FormLabel>
            <InputElement
              value={data[name]}
              onChange={(e) => onInputChange(e, name)}
            />
            {errors && errors[name] && (
              <FormErrorMessage>{errors[name]}</FormErrorMessage>
            )}
          </FormControl>
        );
      })}
    </>
  );
}
