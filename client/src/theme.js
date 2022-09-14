import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const components = {
  Input: {
    defaultProps: {
      focusBorderColor: "purple.200"
    }
  }
}

const theme = extendTheme(
  { config, components },
  withDefaultColorScheme({ colorScheme: "purple" })
);

export default theme;
