import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";

interface BlurryBoxProps extends BoxProps {
  variant?: "outer" | "inner";
}

export const BlurryBox: FC<BlurryBoxProps> = ({
  children,
  variant,
  ...props
}) => {
  if (variant === "inner") {
    return (
      <Box
        p={{ base: "4", md: "8" }}
        background="rgba(210, 210, 210, 0.05)"
        borderRadius="8px"
        {...props}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      p={{ base: "4", md: "8" }}
      background="linear-gradient(162.33deg, rgba(108, 162, 242, 0.08) -0.06%, rgba(151, 189, 246, 0.08) 18.1%, rgba(255, 255, 255, 0) 121.83%);"
      backdropFilter="blur(100px)"
      borderRadius="10px"
      border="1px solid rgba(255,255,255,0.1)"
      {...props}
    >
      {children}
    </Box>
  );
};
