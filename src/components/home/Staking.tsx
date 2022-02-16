/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
import {
  Stack,
  Text,
  TextProps,
  Heading,
  VStack,
  Spinner,
  HStack,
  BoxProps,
  Box,
} from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { useContractCall, useEthers, useTokenBalance } from "@usedapp/core";
import { BigNumber } from "ethers";
import { useRouter } from "next/dist/client/router";
import { FC, useState } from "react";

import { CoreVaultInterface } from "../../abi";
import { CoreDAOContract, CoreVaultContract } from "../../constants";
import { useGlobalLendingStats } from "../../hooks";
import { formatNumber, formatPercent } from "../../utils";
import { TransactionButton } from "../button/TransactionButton";
import { BlurryBox } from "../container";
// import { TokenAmountInput } from "../input";

import { DepositWithdrawButton } from "./DepositWithdrawButton";

/* eslint-disable complexity */
const StatHeader: FC<TextProps> = ({ children }) => {
  return (
    <Text color="whiteAlpha.500" fontWeight="bold">
      {children}
    </Text>
  );
};

interface DepositWithdrawProps extends BoxProps {
  type: string;
}

const Deposit: FC<BoxProps> = ({ ...props }) => {
  return <Box {...props}>Deposit</Box>;
};
const Withdraw: FC<BoxProps> = ({ ...props }) => {
  return <Box {...props}>Withdraw</Box>;
};

const DepositOrWithdraw: FC<DepositWithdrawProps> = ({ type, ...props }) => {
  if (type === "deposit") {
    return <Deposit {...props} />;
  }

  return <Withdraw {...props} />;
};

export const Staking = () => {
  const globalLendingStats = useGlobalLendingStats();
  const { account } = useEthers();
  const router = useRouter();
  const { a: queryAccount } = router.query;

  const coreDaoWalletAmount =
    useTokenBalance(
      CoreDAOContract.address,
      account || (queryAccount as string)
    ) || BigNumber.from(0);

  const userInfo =
    useContractCall({
      abi: CoreVaultInterface,
      address: CoreVaultContract.address,
      method: "userInfo",
      args: [3, account || queryAccount],
    }) ??
    ({
      amount: BigNumber.from(0),
      rewardDebt: BigNumber.from(0),
    } as any);

  const [actionType, setActionType] = useState<string>("deposit");

  const onActionChanged = (value: string) => {
    setActionType(value);
  };

  return (
    <BlurryBox zIndex="0">
      <Heading mb="8" size="lg">
        CoreDAO Staking
      </Heading>

      <VStack align="left" spacing="4">
        <VStack align="left" fontSize={24}>
          <StatHeader>APY</StatHeader>
          {globalLendingStats.coreDaoApy ? (
            <>{formatPercent(globalLendingStats.coreDaoApy)}</>
          ) : (
            <Spinner />
          )}
        </VStack>
      </VStack>

      <Stack
        direction={{ base: "column", md: "row" }}
        mt="8"
        alignItems="left"
        justifyContent="space-between"
      >
        <VStack align="left" spacing="4">
          <VStack align="left">
            <StatHeader>Staked Amount</StatHeader>
            <>{formatNumber(formatEther(userInfo.amount), false, false, 3)}</>
          </VStack>
        </VStack>

        <VStack align="left" spacing="4">
          <VStack align="left">
            <StatHeader>Claimable Core</StatHeader>

            <HStack align="left" spacing="4" justifyContent="space-between">
              <>
                {formatNumber(
                  formatEther(userInfo?.rewardDebt),
                  false,
                  false,
                  3
                )}
              </>
              <TransactionButton
                disabled={userInfo?.rewardDebt.lte(0)}
                onClick={() => {}}
                size="xs"
              >
                claim
              </TransactionButton>
            </HStack>
          </VStack>
        </VStack>

        <VStack align="left" spacing="4">
          <VStack align="left">
            <StatHeader>Unstaked Amount</StatHeader>
            <>
              {formatNumber(formatEther(coreDaoWalletAmount), false, false, 3)}
            </>
          </VStack>
        </VStack>

        {/* }
        <TokenAmountInput
          size="lg"
          max={daiLeftToBorrow.toString()}
          virtualMax={safeDaiLeftToBorrow.toString()}
          tokenDecimals={18}
          value={daiAmount.value}
          onUserInput={(input, valueAsBigNumber) =>
            setDaiAmount({ value: input, valueAsBigNumber })
          }
          showMaxButton
        /> */}
      </Stack>
      <VStack mt="8" align="left" spacing="4">
        <DepositWithdrawButton onChange={onActionChanged} value={actionType} />
        <DepositOrWithdraw mt="8" type={actionType} />
      </VStack>
    </BlurryBox>
  );
};
