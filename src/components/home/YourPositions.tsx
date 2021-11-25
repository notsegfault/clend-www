/* eslint-disable complexity */
import {
  Heading,
  Stack,
  VStack,
  Text,
  TextProps,
  BoxProps,
  // HStack,
  // Button,
} from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";
import { FC } from "react";
import Moment from "react-moment";

import { TokenInfos } from "../../constants";
import { useUserLendingInfo, useGlobalLendingStats } from "../../hooks";
import { formatNumber, formatUSD } from "../../utils";
import { TokenIcon } from "../icon/TokenIcon";
import { BlurryBox } from "components/container";

const StatHeader: FC<TextProps> = ({ children }) => {
  return (
    <Text color="whiteAlpha.500" fontWeight="bold">
      {children}
    </Text>
  );
};

interface YourPositionProps extends BoxProps {
  onClickToScroll: (actionType: string) => void;
}

export const YourPositions: FC<YourPositionProps> = ({
  onClickToScroll,
  ...props
}) => {
  const globalLendingStats = useGlobalLendingStats();

  const { yearlyPercentInterest, loanDefaultThresholdPercent } =
    globalLendingStats;
  const userLendingInfo = useUserLendingInfo();
  const {
    userCollaterals,
    userCollateralValue,
    userTotalDebt,
    accruedInterest,
    debtorSummary,
  } = userLendingInfo;

  const daiLeftToBorrow =
    userCollateralValue && userTotalDebt
      ? userCollateralValue.sub(userTotalDebt)
      : BigNumber.from(0);

  const amountDAIBorrowed = debtorSummary
    ? Number(formatEther(debtorSummary.amountDAIBorrowed))
    : 0;

  const yearlyPercentInterestNumber = yearlyPercentInterest
    ? yearlyPercentInterest.toNumber()
    : 0;

  const userTotalDebtNumber = userTotalDebt
    ? Number(formatEther(userTotalDebt))
    : 0;

  const userCollateralValueNumber = userCollateralValue
    ? Number(formatEther(userCollateralValue))
    : 0;

  const threshold = loanDefaultThresholdPercent
    ? loanDefaultThresholdPercent.toNumber()
    : 0;

  const liquidationAmount = (userCollateralValueNumber * threshold) / 100;

  const oneYearInSeconds = 365 * 24 * 60 * 60;
  const deltaAmountBeforeLiquidation =
    (liquidationAmount - userTotalDebtNumber) * (oneYearInSeconds * 100);

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  const liquidationEstTimestamp = amountDAIBorrowed
    ? Math.floor(
        deltaAmountBeforeLiquidation /
          (amountDAIBorrowed * yearlyPercentInterestNumber) +
          currentTimestampInSeconds
      )
    : 0;
  const liquidationEstDate = new Date(liquidationEstTimestamp * 1000);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tokenInfos = [...TokenInfos.values()];

  return (
    <BlurryBox {...props}>
      <Heading mb="8" size="lg">
        Your Positions
      </Heading>
      {userTotalDebtNumber === 0 ? (
        <Text>You have no loans</Text>
      ) : (
        <Stack
          direction={{ base: "column", md: "row" }}
          mt="8"
          alignItems="left"
          justifyContent="space-between"
        >
          <VStack align="left" spacing="4">
            <VStack align="left">
              <StatHeader>COLLATERAL</StatHeader>
              {userCollaterals &&
                userCollaterals.length &&
                userCollaterals.map((collateral, index) => {
                  let tokenInfo;
                  if (collateral.collateralAddress) {
                    tokenInfo = tokenInfos.find(
                      (t) =>
                        t.address.toLowerCase() ===
                        collateral.collateralAddress.toLowerCase()
                    );
                  }
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                      {tokenInfo && collateral.amountCollateral && (
                        <Text>
                          <TokenIcon
                            tokenId={tokenInfo.value}
                            display="inline-block"
                            marginRight="3"
                          />
                          <span>{`${formatNumber(
                            formatEther(collateral.amountCollateral)
                          )} ${tokenInfo.name}`}</span>
                        </Text>
                      )}
                    </div>
                  );
                })}
            </VStack>
          </VStack>

          <VStack align="left" spacing="4">
            {accruedInterest && (
              <VStack align="left">
                <StatHeader>INTEREST ACCRUED</StatHeader>
                <Text>{formatUSD(formatEther(accruedInterest))}</Text>
              </VStack>
            )}
            <VStack align="left">
              <StatHeader>DAI LEFT TO BORROW</StatHeader>
              <Text>
                {daiLeftToBorrow.isNegative()
                  ? "$0"
                  : formatUSD(formatEther(daiLeftToBorrow))}
              </Text>
            </VStack>
          </VStack>

          <VStack align="left" spacing="4">
            <VStack align="left">
              <StatHeader>EST. TIME TO LIQUIDATION</StatHeader>
              <Text>
                <Moment fromNow>{liquidationEstDate.toDateString()}</Moment>
              </Text>
            </VStack>
            {/* <VStack align="left">
            <HStack>
              <Button onClick={() => onClickToScroll("repay")}>Repay</Button>
              <Button onClick={() => onClickToScroll("borrow")}>
                Borrow More
              </Button>
            </HStack>
          </VStack> */}
          </VStack>
        </Stack>
      )}
    </BlurryBox>
  );
};
