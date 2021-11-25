/* eslint-disable sonarjs/no-duplicate-string */
import { theme, extendTheme } from "@chakra-ui/react";

export const customTheme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  styles: {
    global: {
      body: {
        bg: "#201F2E",
        color: "white",
      },
    },
  },
  fonts: {
    ...theme.fonts,
    body: "Inter, sans-serif",
    heading: "Inter, serif",
  },
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          bg: "#201F2E",
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "rgba(255, 255, 255, 0.05)",
            borderRadius: "xl",
            _placeholder: {
              color: "rgba(255, 255, 255, 0.5)",
            },
            _focus: {
              borderColor: "none",
              boxShadow: "none",
            },
          },
        },
      },
    },
    Button: {
      variants: {
        solid: {
          bg: "transparent",
          bgGradient: "linear(95.32deg, #2F55DE -18.91%, #EA5332 148.09%)",
          opacity: 0.85,
          _active: {
            bgGradient: "linear(95.32deg, #2F55DE -18.91%, #EA5332 148.09%)",
          },
          _focus: {
            boxShadow: "none",
          },
          _hover: {
            opacity: 1,
            bg: "transparent",
            border: "10px",
            bgGradient: "linear(95.32deg, #2F55DE -18.91%, #EA5332 148.09%)",
            _disabled: {
              opacity: 0.4,
              bgColor: "whiteAlpha.300",
            },
          },
          _disabled: {
            opacity: 0.4,
            bg: "whiteAlpha.300",
          },
        },
        outline: {
          bgColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid",
          borderColor: "whiteAlpha.500",
          color: "whiteAlpha.800",
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
  },
});
