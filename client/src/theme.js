import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme(
  { config },
  withDefaultColorScheme({ colorScheme: "purple" })
);

export default theme;
