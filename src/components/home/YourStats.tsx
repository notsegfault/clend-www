import {
  Heading,
  Divider,
  Stack,
  VStack,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { FC } from "react";

import { BlurryBox } from "components/container";

const StatHeader: FC<TextProps> = ({ children }) => {
  return (
    <Text color="whiteAlpha.500" fontWeight="bold">
      {children}
    </Text>
  );
};
export const YourStats = ({ ...props }) => {
  return (
    <BlurryBox {...props}>
      <Heading mb="4" size="lg">
        Your Stats:
      </Heading>
      <Divider orientation="horizontal" />
      <Stack
        direction={{ base: "column", md: "row" }}
        mt="4"
        alignItems="left"
        justifyContent="space-between"
      >
        <VStack align="left">
          <StatHeader>TOTAL BORROWED</StatHeader>
          <Text>$18,000,250</Text>
        </VStack>
        <VStack align="left">
          <StatHeader>TOTAL INTEREST ACCRUED</StatHeader>
          <Text>$23,000,000</Text>
        </VStack>
        <VStack align="left">
          <StatHeader>DAI LEFT TO BORROW</StatHeader>
          <Text>$250,000</Text>
        </VStack>
      </Stack>
    </BlurryBox>
  );
};
