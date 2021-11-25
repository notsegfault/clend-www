import {
  Heading,
  Divider,
  Stack,
  VStack,
  Text,
  HStack,
  TextProps,
  Center,
} from "@chakra-ui/react";
import { FC } from "react";

import { useGlobalLendingStats } from "../../hooks/useGlobalLendingStats";
import { formatUSD } from "../../utils";
import { BlurryBox } from "components/container";

const StatHeader: FC<TextProps> = ({ children }) => {
  return (
    <Text color="whiteAlpha.500" fontWeight="bold">
      {children}
    </Text>
  );
};
export const LendingStats = ({ ...props }) => {
  const globalLendingStats = useGlobalLendingStats();

  return (
    <BlurryBox {...props}>
      <Heading mb="4" size="lg">
        Lending Stats:
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
          <Text>{formatUSD(globalLendingStats.totalAmountDAIBorrowed)}</Text>
        </VStack>
        <VStack align="left">
          <StatHeader>TOTAL INTEREST ACCRUED</StatHeader>
          <Text>{formatUSD(globalLendingStats.totalInterestAccrued)}</Text>
        </VStack>
        <VStack align="left">
          <StatHeader>LENDING POSITION</StatHeader>
          <Text>{formatUSD(globalLendingStats.totalLendingPositions)}</Text>
        </VStack>
      </Stack>
      <Center>
        <BlurryBox
          variant="inner"
          mt="6"
          flexGrow={1}
          maxWidth={{ base: "100%", md: "60%" }}
        >
          <HStack
            direction={{ base: "column", md: "column" }}
            justifyContent="space-between"
            alignItems="start"
          >
            <VStack align="left">
              <StatHeader>Core DAO Lending TVL</StatHeader>
              <Text>{formatUSD(globalLendingStats.coreDaoLendingTVL)}</Text>
              <StatHeader>Core DAO Lending Positions</StatHeader>
              <Text>
                {formatUSD(globalLendingStats.coreDaoLendingPositions)}
              </Text>
            </VStack>
            <VStack align="left">
              <StatHeader>Core Lending TVL</StatHeader>
              <Text>{formatUSD(globalLendingStats.coreLendingTVL)}</Text>
              <StatHeader>Core Lending Positions</StatHeader>
              <Text>{formatUSD(globalLendingStats.coreLendingPositions)}</Text>
            </VStack>
          </HStack>
        </BlurryBox>
      </Center>
    </BlurryBox>
  );
};
