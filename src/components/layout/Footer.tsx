import { Box, Text } from "@chakra-ui/react";

import { version } from "../../../app.config";

export const Footer = () => {
  return (
    <Box as="footer" width="full" textAlign="right" p="4">
      <Text fontSize="xs" color="gray.500">
        version {version}
      </Text>
    </Box>
  );
};
