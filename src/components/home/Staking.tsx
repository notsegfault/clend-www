/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
import {
  Stack,
  Text,
  TextProps,
  Heading,
  VStack,
  Spinner,
  BoxProps,
  Box,
  HStack,
} from "@chakra-ui/react";
import { formatEther, parseEther } from "@ethersproject/units";
import {
  useContractCall,
  useContractFunction,
  useEthers,
  useTokenBalance,
} from "@usedapp/core";
import { BigNumber } from "ethers";
import { useRouter } from "next/dist/client/router";
import { FC, useEffect, useState } from "react";

import { CoreVaultInterface } from "../../abi";
import {
  CoreContract,
  CoreDAOContract,
  CoreDAOToken,
  CoreVaultContract,
} from "../../constants";
import { useGlobalLendingStats } from "../../hooks";
import { formatNumber, formatPercent } from "../../utils";
import { TransactionButton } from "../button/TransactionButton";
import { BlurryBox } from "../container";
import { InputFieldAmount, TokenAmountInput } from "../input";

import { DepositWithdrawButton } from "./DepositWithdrawButton";

/* eslint-disable complexity */
const StatHeader: FC<TextProps> = ({ children, ...props }) => {
  return (
    <Text color="whiteAlpha.500" fontWeight="bold" {...props}>
      {children}
    </Text>
  );
};

interface DepositWithdrawProps extends BoxProps {
  type: string;
  coreDaoWalletAmount: BigNumber;
  coreDaoStaked: BigNumber;
}

interface DepositProps extends BoxProps {
  coreDaoWalletAmount: BigNumber;
}

interface WithdrawProps extends BoxProps {
  coreDaoStaked: BigNumber;
}

const Deposit: FC<DepositProps> = ({ coreDaoWalletAmount, ...props }) => {
  const { account } = useEthers();
  const [depositAmount, setDepositAmount] = useState({
    value: "",
    valueAsBigNumber: undefined,
  } as InputFieldAmount);

  const { state: stakingState, send: stake } = useContractFunction(
    CoreVaultContract,
    "deposit",
    {
      transactionName: "Stake",
    }
  );

  useEffect(() => {
    if (stakingState.status === "Success") {
      setDepositAmount({
        value: "",
        valueAsBigNumber: undefined,
      });
    }
  }, [stakingState]);

  const onStake = async () => {
    try {
      if (depositAmount.valueAsBigNumber) {
        await stake(3, depositAmount.valueAsBigNumber.toString());
      } else {
        await stake(3, parseEther(depositAmount.value.toString()));
      }
    } catch (error: any) {
      if (error?.code !== 4001) {
        console.error(error);
      }
    }
  };

  return (
    <Box {...props}>
      <VStack align="left" spacing="8">
        <TokenAmountInput
          size="lg"
          max={coreDaoWalletAmount.toString()}
          tokenDecimals={18}
          value={depositAmount.value}
          onUserInput={(input, valueAsBigNumber) =>
            setDepositAmount({ value: input, valueAsBigNumber })
          }
          showMaxButton
        />
        <TransactionButton
          disabled={!account}
          onClick={onStake}
          token={CoreDAOToken}
          spenderAddress={CoreVaultContract.address}
        >
          Deposit
        </TransactionButton>
      </VStack>
    </Box>
  );
};
const Withdraw: FC<WithdrawProps> = ({ coreDaoStaked, ...props }) => {
  const { account } = useEthers();
  const [withdrawAmount, setWithdrawAmount] = useState({
    value: "",
    valueAsBigNumber: undefined,
  } as InputFieldAmount);

  const { state: withdrawState, send: withdraw } = useContractFunction(
    CoreVaultContract,
    "withdraw",
    {
      transactionName: "Unstake",
    }
  );

  useEffect(() => {
    if (withdrawState.status === "Success") {
      setWithdrawAmount({
        value: "",
        valueAsBigNumber: undefined,
      });
    }
  }, [withdrawState]);

  const onWithdraw = async () => {
    try {
      if (withdrawAmount.valueAsBigNumber) {
        await withdraw(3, withdrawAmount.valueAsBigNumber.toString());
      } else {
        await withdraw(3, parseEther(withdrawAmount.value.toString()));
      }
    } catch (error: any) {
      if (error?.code !== 4001) {
        console.error(error);
      }
    }
  };

  return (
    <Box {...props}>
      <VStack align="left" spacing="8">
        <TokenAmountInput
          size="lg"
          max={coreDaoStaked.toString()}
          tokenDecimals={18}
          value={withdrawAmount.value}
          onUserInput={(input, valueAsBigNumber) =>
            setWithdrawAmount({ value: input, valueAsBigNumber })
          }
          showMaxButton
        />
        <TransactionButton
          disabled={!account}
          onClick={onWithdraw}
          spenderAddress={CoreVaultContract.address}
        >
          Withdraw
        </TransactionButton>
      </VStack>
    </Box>
  );
};

const DepositOrWithdraw: FC<DepositWithdrawProps> = ({
  type,
  coreDaoWalletAmount,
  coreDaoStaked,
  ...props
}) => {
  if (type === "stake") {
    return <Deposit {...props} coreDaoWalletAmount={coreDaoWalletAmount} />;
  }

  return <Withdraw {...props} coreDaoStaked={coreDaoStaked} />;
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
    ) ?? BigNumber.from(0);

  const coreWalletAmount =
    useTokenBalance(
      CoreContract.address,
      account || (queryAccount as string)
    ) ?? BigNumber.from(0);

  const userInfo =
    useContractCall({
      abi: CoreVaultInterface,
      address: CoreVaultContract.address,
      method: "userInfo",
      args: [3, account || queryAccount],
    }) ??
    ({
      amount: BigNumber.from(0),
    } as any);

  const pendingCore =
    useContractCall({
      abi: CoreVaultInterface,
      address: CoreVaultContract.address,
      method: "pendingCore",
      args: [3, account || queryAccount],
    })?.[0] ?? BigNumber.from(0);

  const [actionType, setActionType] = useState<string>("stake");

  const { send: deposit } = useContractFunction(CoreVaultContract, "deposit", {
    transactionName: "Claim",
  });

  const onClaim = async () => {
    try {
      await deposit(3, 0);
    } catch (error: any) {
      if (error?.code !== 4001) {
        console.error(error);
      }
    }
  };

  const onActionChanged = (value: string) => {
    setActionType(value);
  };

  return (
    <BlurryBox zIndex="0">
      <Heading mb="8" size="lg">
        CoreDAO Staking
      </Heading>

      <Stack
        direction={{ base: "column", md: "row" }}
        alignItems="left"
        justifyContent="space-between"
        spacing={{ base: "4", md: "4" }}
        mt={{ base: "4", md: "8" }}
      >
        <VStack align="left" width={{ base: "", md: "48%" }}>
          <StatHeader fontSize={{ base: 18, md: 24 }}>
            {" "}
            Stake CoreDAO - Earn Yield
          </StatHeader>
          <Box
            color="whiteAlpha.500"
            align="justify"
            fontSize="sm"
            mt={{ base: "2", md: "6" }}
          >
            Stake your CoreDAO governance token and earn yield on every CORE Fee
            On Transfer (FoT). The yearly rate of return depends on CORE
            transaction volume and will vary over time.
          </Box>
        </VStack>

        <VStack alignItems={{ base: "flex-start", md: "flex-end" }} spacing="2">
          <StatHeader fontSize={{ base: 18, md: 24 }}>Average APY</StatHeader>
          {globalLendingStats.stakingApy ? (
            <HStack
              alignItems={{ base: "flex-start", md: "flex-end" }}
              spacing="2"
            >
              <HStack pr="2" borderRight="1px" borderColor="whiteAlpha.500">
                <Box fontSize={{ base: 14, md: 16 }}>
                  {formatPercent(globalLendingStats.stakingApy.daily, 2)}
                </Box>
                <Box color="whiteAlpha.500" fontSize={14}>
                  24h
                </Box>
              </HStack>
              <HStack pr="2" borderRight="1px" borderColor="whiteAlpha.500">
                <Box fontSize={{ base: 14, md: 16 }}>
                  {formatPercent(globalLendingStats.stakingApy.weekly, 2)}
                </Box>
                <Box color="whiteAlpha.500" fontSize={14}>
                  7d
                </Box>
              </HStack>
              <HStack>
                <Box fontSize={{ base: 14, md: 16 }}>
                  {formatPercent(globalLendingStats.stakingApy.monthly, 2)}
                </Box>
                <Box color="whiteAlpha.500" fontSize={14}>
                  30d
                </Box>
              </HStack>
            </HStack>
          ) : (
            <Spinner />
          )}
        </VStack>
      </Stack>
      <Stack
        direction={{ base: "column-reverse", md: "row" }}
        alignItems="left"
        justifyContent="space-between"
        spacing={{ base: "4", md: "0" }}
        mt={{ base: "4", md: "8" }}
      >
        <BlurryBox variant="inner" mr={{ base: "0", md: "8" }} flexGrow={1}>
          <DepositWithdrawButton
            onChange={onActionChanged}
            value={actionType}
          />
          <DepositOrWithdraw
            mt="8"
            type={actionType}
            coreDaoWalletAmount={coreDaoWalletAmount}
            coreDaoStaked={userInfo?.amount}
          />
        </BlurryBox>

        <BlurryBox variant="inner" flexGrow={0}>
          <VStack alignItems="left" spacing="4" justifyContent="space-between">
            <StatHeader color="white">Your Staking Summary</StatHeader>

            <Stack
              direction={{ base: "column", md: "row" }}
              alignItems="left"
              spacing="4"
            >
              <VStack align="left" spacing="4" mr="24">
                <VStack align="left" spacing="4">
                  <VStack align="left">
                    <StatHeader>Staked CoreDAO</StatHeader>
                    <>
                      {formatNumber(
                        formatEther(userInfo.amount),
                        false,
                        false,
                        3
                      )}
                    </>
                  </VStack>
                </VStack>

                <VStack align="left" spacing="4">
                  <VStack align="left">
                    <StatHeader>CORE in Wallet</StatHeader>
                    <>
                      {formatNumber(
                        formatEther(coreWalletAmount),
                        false,
                        false,
                        3
                      )}
                    </>
                  </VStack>
                </VStack>
              </VStack>

              <VStack align="left" spacing="4">
                <VStack align="left" spacing="4">
                  <VStack align="left">
                    <StatHeader>Unstaked CoreDAO</StatHeader>
                    <>
                      {formatNumber(
                        formatEther(coreDaoWalletAmount),
                        false,
                        false,
                        3
                      )}
                    </>
                  </VStack>
                </VStack>

                <VStack align="left" spacing="4">
                  <StatHeader>Claimable CORE</StatHeader>

                  <>
                    {formatNumber(
                      formatEther(pendingCore.toString()),
                      false,
                      false,
                      3
                    )}
                  </>

                  <TransactionButton
                    disabled={pendingCore?.lte(0) || !account}
                    onClick={onClaim}
                    size="xs"
                    display={{ base: "none", md: "block" }}
                  >
                    claim rewards
                  </TransactionButton>

                  <TransactionButton
                    disabled={pendingCore?.lte(0) || !account}
                    onClick={onClaim}
                    isFullWidth
                    display={{ base: "block", md: "none" }}
                  >
                    claim rewards
                  </TransactionButton>
                </VStack>
              </VStack>
            </Stack>
          </VStack>
        </BlurryBox>
      </Stack>
    </BlurryBox>
  );
};
