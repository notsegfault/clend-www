import {
  Flex,
  Img,
  VStack,
  Text,
  Heading,
  HStack,
  BoxProps,
} from "@chakra-ui/react";
import { FC } from "react";

export const Hero: FC<BoxProps> = ({ ...props }) => {
  return (
    <Flex mt={{ base: "6", sm: "0" }} {...props}>
      <VStack align="left">
        <HStack mb={{ base: "2", md: "4" }} justifyContent="space-between">
          <Heading fontSize={{ base: "2xl", md: "4xl" }} alignSelf="center">
            CoreDAO Lending Protocol
          </Heading>
          <Img
            display={{ base: "flex", sm: "none" }}
            w="30%"
            src="/header-logo.png"
          />
        </HStack>
        <Text color="gray.500" fontSize="lg" align="justify" />
      </VStack>
      <Img
        display={{ base: "none", sm: "flex" }}
        ml="6"
        w="40%"
        alignSelf="center"
        src="/header-logo.png"
      />
    </Flex>
  );
};
