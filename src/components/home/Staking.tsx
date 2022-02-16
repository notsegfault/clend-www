/* eslint-disable complexity */
import {
  Heading,
  Stack,
  VStack,
  Text,
  TextProps,
  BoxProps,
  Spinner,
} from "@chakra-ui/react";
import { FC } from "react";

import { useGlobalLendingStats } from "../../hooks";
import { formatPercent } from "../../utils";
import { BlurryBox } from "components/container";

const StatHeader: FC<TextProps> = ({ children }) => {
  return (
    <Text color="whiteAlpha.500" fontWeight="bold">
      {children}
    </Text>
  );
};

type StakingProps = BoxProps;

export const Staking: FC<StakingProps> = ({ ...props }) => {
  const globalLendingStats = useGlobalLendingStats();

  return (
    <BlurryBox {...props} zIndex="-1">
      <Heading mb="8" size="lg">
        Staking
      </Heading>
      <Stack
        direction={{ base: "column", md: "row" }}
        mt="8"
        alignItems="left"
        justifyContent="space-between"
      >
        <VStack align="left" spacing="4">
          <VStack align="left">
            <StatHeader>APY</StatHeader>
            {globalLendingStats.coreDaoApy ? (
              <>{formatPercent(globalLendingStats.coreDaoApy)}</>
            ) : (
              <Spinner />
            )}
          </VStack>
        </VStack>
      </Stack>
    </BlurryBox>
  );
};
