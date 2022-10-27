import { Input, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";

export default function InputList({ inputs, data, errors, setData, setErrors, onSubmit }) {
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
      {inputs.map(({ name, label, isPassword }, index) => {
        const InputElement = isPassword ? PasswordInput : Input;

        function onKeyUp(e) {
          if (onSubmit && index == inputs.length - 1 && e.key == "Enter") {
            onSubmit();
          }
        }

        return (
          <FormControl key={index} isInvalid={errors && errors[name]}>
            <FormLabel>{label || name}</FormLabel>
            <InputElement value={data[name]} onChange={(e) => onInputChange(e, name)} onKeyUp={onKeyUp} />
            {errors && errors[name] && <FormErrorMessage>{errors[name]}</FormErrorMessage>}
          </FormControl>
        );
      })}
    </>
  );
}
