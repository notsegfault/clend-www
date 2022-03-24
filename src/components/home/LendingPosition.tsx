/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { Stack, VStack, Text, HStack, TextProps } from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";
import {
  FC,
  useState,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import Moment from "react-moment";

import {
  useCollateral,
  useGlobalLendingStats,
  useUserLendingInfo,
} from "../../hooks";
import { TokenId } from "../../types";
import { formatNumber, formatPercent, formatUSD } from "../../utils";
import { InfoTooltip } from "../tooltip";
import { BlurryBox } from "components/container";

import { BorrowRepayButton } from "./BorrowRepayButton";
import { SwapBox } from "./SwapBox";

const StatHeader: FC<TextProps> = ({ children }) => {
  return <Text fontWeight="bold">{children}</Text>;
};

const Section: FC<{ label: string; value: string; tooltip?: ReactNode }> = ({
  label,
  value,
  tooltip,
}) => {
  return (
    <HStack justifyContent="space-between">
      <Text color="whiteAlpha.500">{label}</Text>
      <HStack>
        <Text>{value}</Text>
        {tooltip && <InfoTooltip>{tooltip}</InfoTooltip>}
      </HStack>
    </HStack>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LendingPosition = forwardRef((props: { scrollRef: any }, ref) => {
  const { scrollRef } = props;
  const { setCollateralContext } = useCollateral();
  const [actionType, setActionType] = useState<string>("borrow");
  const globalLendingStats = useGlobalLendingStats();
  const userLendingInfo = useUserLendingInfo();

  const {
    yearlyPercentInterest,
    loanDefaultThresholdPercent,
    availableDaiToBorrow,
  } = globalLendingStats;
  const { userCollateralValue, userTotalDebt, accruedInterest, debtorSummary } =
    userLendingInfo;

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

  const ltv =
    userTotalDebtNumber &&
    userCollateralValueNumber &&
    userCollateralValueNumber > 0 &&
    threshold
      ? (userTotalDebtNumber / liquidationAmount) * 100
      : 0;

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

  let ltvColor = "#68d391";
  if (ltv > 70 && ltv < 90) {
    ltvColor = "#ed8936";
  } else if (ltv > 90) {
    ltvColor = "#e53e3e";
  }

  const onActionChanged = (value: string) => {
    setActionType(value);
    setCollateralContext(TokenId.Core);
  };

  useImperativeHandle(ref, () => ({
    onActionChanged,
  }));

  return (
    <Stack
      mt={{ base: "0", lg: "6" }}
      direction={{ base: "column", lg: "row" }}
      spacing="6"
      alignItems="left"
      ref={scrollRef}
    >
      <BlurryBox>
        <VStack alignItems="left" spacing="4">
          <StatHeader>Open Positions Summary:</StatHeader>
          <Section
            label="Collateral Value:"
            tooltip="The total value of your deposited collateral"
            value={
              userCollateralValue
                ? formatUSD(formatEther(userCollateralValue))
                : "$0"
            }
          />
          <Section
            label="DAI Borrowed:"
            tooltip="The current borrowed amount"
            value={
              debtorSummary?.amountDAIBorrowed
                ? formatUSD(formatEther(debtorSummary?.amountDAIBorrowed))
                : "$0"
            }
          />
          <Section
            label="Left to Borrow:"
            tooltip="Amount you can still borrow"
            value={
              daiLeftToBorrow.isNegative()
                ? "$0"
                : `≈ ${formatNumber(
                    formatEther(daiLeftToBorrow),
                    true,
                    true,
                    6
                  )}`
            }
          />
          <Section
            label="Interest Accrued:"
            tooltip="The accrued interests on your loan"
            value={
              accruedInterest
                ? `${formatUSD(formatEther(accruedInterest))}`
                : "$0"
            }
          />
        </VStack>
        <VStack alignItems="left" spacing="4" mt="8">
          <StatHeader>Loan Stats:</StatHeader>
          <Section
            label="DAI left to borrow:"
            tooltip="DAI amount still available to be borrowed"
            value={
              availableDaiToBorrow
                ? formatNumber(formatEther(availableDaiToBorrow))
                : "0"
            }
          />
          <Section
            label="Interest per year:"
            tooltip="Amount of interest you're paying yearly on your borrowed amount"
            value={
              yearlyPercentInterest
                ? formatPercent(yearlyPercentInterest.toString())
                : "0"
            }
          />
          <Section
            label="Liquidation Threshold:"
            tooltip="A liquidation occurs when your total debt (borrow and accrued interests) are exceeding this threshold"
            value={
              loanDefaultThresholdPercent
                ? formatPercent(loanDefaultThresholdPercent.toString())
                : "0"
            }
          />
          {userTotalDebtNumber !== 0 && (
            <>
              <HStack justifyContent="space-between">
                <Text color="whiteAlpha.500">LTV:</Text>
                <HStack>
                  <Text color={ltvColor}>{formatPercent(ltv.toString())}</Text>
                  <InfoTooltip>
                    The ratio of your loan to the value of your Collateral
                  </InfoTooltip>
                </HStack>
              </HStack>
              {debtorSummary && (
                <HStack justifyContent="space-between">
                  <Text color="whiteAlpha.500">
                    Est. Time to <br />
                    Liquidation:
                  </Text>
                  <HStack>
                    <Moment fromNow>{liquidationEstDate.toDateString()}</Moment>
                    <InfoTooltip>
                      An estimated liquidation target time
                    </InfoTooltip>
                  </HStack>
                </HStack>
              )}
            </>
          )}
        </VStack>
      </BlurryBox>

      <BlurryBox flexGrow={1}>
        <BorrowRepayButton onChange={onActionChanged} value={actionType} />
        <SwapBox mt="6" type={actionType} />
      </BlurryBox>
    </Stack>
  );
});
