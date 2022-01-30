/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
import {
  BoxProps,
  VStack,
  Text,
  HStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { formatEther, parseEther } from "@ethersproject/units";
import {
  useEthers,
  useTokenBalance,
  useContractFunction,
  useBlockMeta,
  ChainId,
} from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { FC, useState, useEffect } from "react";

import { ERC20Interface } from "../../abi/ERC20Interface";
import { DaiToken, TokenInfos, LendingContract } from "../../constants";
import {
  useGlobalLendingStats,
  useUserLendingInfo,
  useCollateral,
} from "../../hooks";
import { TokenContract, TokenId } from "../../types";
import { formatNumber } from "../../utils";
import { BlurryBox } from "../container";
import { TokenAmountInput } from "../input";
import { TokenMenu, TokenMenuItemContent } from "../menu";
import { TransactionButton } from "components/button/TransactionButton";
import { UserWallet } from "components/user/UserWallet";

const boxShadow =
  "2px 4px 12px rgba(0, 0, 0, 0.15), 0px 21px 53px rgba(77, 85, 195, 0.38), inset -2px -1px 8px rgba(255, 255, 255, 0.22)";

interface SwapBoxProps extends BoxProps {
  type: string;
}

const BorrowButton = (props: {
  amount: number;
  tokenBalance: number;
  daiAmount: number;
  daiLeftToBorrow: BigNumber;
  availableDai: number;
  onReset: () => void;
}) => {
  const {
    amount,
    tokenBalance,
    daiAmount,
    daiLeftToBorrow,
    availableDai,
    onReset,
  } = props;
  const { collateralContext } = useCollateral();

  const collateralToken = TokenInfos.get(collateralContext);
  const collateralTokenAddress = collateralToken?.address;
  const collateralTokenName = collateralToken?.name;
  const collateralContract = new TokenContract(
    collateralTokenName || "",
    collateralTokenName || "",
    ChainId.Mainnet,
    collateralTokenAddress || "",
    new ethers.Contract(collateralTokenAddress || "", ERC20Interface)
  );

  const { state: addCollateralState, send: addCollateral } =
    useContractFunction(LendingContract, "addCollateral", {
      transactionName: "AddCollateral",
    });

  const { state: borrowState, send: borrow } = useContractFunction(
    LendingContract,
    "borrow",
    {
      transactionName: "Borrow",
    }
  );

  const { state: addCollateralAndBorrowState, send: addCollateralAndBorrow } =
    useContractFunction(LendingContract, "addCollateralAndBorrow", {
      transactionName: "Add Collateral And Borrow",
    });

  useEffect(() => {
    if (
      addCollateralState.status === "Success" ||
      borrowState.status === "Success" ||
      addCollateralAndBorrowState.status === "Success"
    ) {
      onReset();
    }
  }, [addCollateralState, borrowState, addCollateralAndBorrowState]);

  const onDepositCollateral = async () => {
    try {
      if (collateralTokenAddress) {
        await addCollateral(
          collateralTokenAddress,
          parseEther(amount.toString()).toString()
        );
      }
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error);
      }
    }
  };

  const onBorrow = async () => {
    try {
      await borrow(parseEther(daiAmount.toString()));
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error);
      }
    }
  };

  const onDepositCollateralAndBorrow = async () => {
    try {
      if (collateralTokenAddress) {
        await addCollateralAndBorrow(
          collateralTokenAddress,
          parseEther(amount.toString()).toString(),
          parseEther(daiAmount.toString()).toString()
        );
      }
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {(amount === 0 && daiAmount === 0) || amount > tokenBalance ? (
        <TransactionButton disabled boxShadow={boxShadow} alignSelf="center">
          Enter Amount
        </TransactionButton>
      ) : (
        <>
          {amount > 0 && amount <= tokenBalance && daiAmount === 0 && (
            <TransactionButton
              token={collateralContract}
              spenderAddress={LendingContract.address}
              boxShadow={boxShadow}
              alignSelf="center"
              onClick={onDepositCollateral}
            >
              Deposit Collateral
            </TransactionButton>
          )}
          {amount === 0 &&
            daiAmount > 0 &&
            (availableDai > daiAmount ? (
              <TransactionButton
                boxShadow={boxShadow}
                alignSelf="center"
                onClick={onBorrow}
                disabled={
                  daiAmount <= 0 ||
                  Number(daiAmount) > Number(formatEther(daiLeftToBorrow))
                }
              >
                Borrow
              </TransactionButton>
            ) : (
              <TransactionButton
                boxShadow={boxShadow}
                alignSelf="center"
                onClick={onBorrow}
                disabled
              >
                Not Enough DAI Left
              </TransactionButton>
            ))}
          {amount > 0 &&
            amount <= tokenBalance &&
            daiAmount > 0 &&
            (availableDai > daiAmount ? (
              <TransactionButton
                token={collateralContract}
                spenderAddress={LendingContract.address}
                boxShadow={boxShadow}
                alignSelf="center"
                onClick={onDepositCollateralAndBorrow}
                disabled={
                  daiAmount <= 0 ||
                  Number(daiAmount) > Number(formatEther(daiLeftToBorrow))
                }
              >
                Deposit Collateral & Borrow
              </TransactionButton>
            ) : (
              <TransactionButton
                token={collateralContract}
                spenderAddress={LendingContract.address}
                boxShadow={boxShadow}
                alignSelf="center"
                onClick={onDepositCollateralAndBorrow}
                disabled
              >
                Not Enough DAI Left
              </TransactionButton>
            ))}
        </>
      )}
    </>
  );
};

const RepayButton = (props: {
  amount: number;
  tokenBalance: number;
  onReset: () => void;
}) => {
  const { amount, tokenBalance, onReset } = props;
  const { collateralContext } = useCollateral();

  const collateralToken = TokenInfos.get(collateralContext);
  const collateralTokenAddress = collateralToken?.address;
  const collateralTokenName = collateralToken?.name;
  const collateralContract = new TokenContract(
    collateralTokenName || "",
    collateralTokenName || "",
    ChainId.Mainnet,
    collateralTokenAddress || "",
    new ethers.Contract(collateralTokenAddress || "", ERC20Interface)
  );

  const { state: repayLoanState, send: repayLoanSend } = useContractFunction(
    LendingContract,
    "repayLoan",
    {
      transactionName: "RepayLoan",
    }
  );

  useEffect(() => {
    if (repayLoanState.status === "Success") {
      onReset();
    }
  }, [repayLoanState]);

  const onRepayLoan = async () => {
    try {
      await repayLoanSend(
        collateralTokenAddress,
        parseEther(amount.toString()).toString()
      );
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {amount === 0 || amount > tokenBalance ? (
        <TransactionButton disabled boxShadow={boxShadow} alignSelf="center">
          Enter Amount
        </TransactionButton>
      ) : (
        <>
          {amount > 0 && amount <= tokenBalance && (
            <TransactionButton
              token={collateralContract}
              spenderAddress={LendingContract.address}
              boxShadow={boxShadow}
              alignSelf="center"
              onClick={onRepayLoan}
            >
              Repay
            </TransactionButton>
          )}
        </>
      )}
    </>
  );
};

const Borrow = ({ ...props }) => {
  const [amount, setAmount] = useState("");
  const [daiAmount, setDaiAmount] = useState("");
  const { collateralContext } = useCollateral();
  const globalLendingStats = useGlobalLendingStats();
  const userLendingInfo = useUserLendingInfo();

  const { yearlyPercentInterest, collaterabilityOfToken } = globalLendingStats;
  const { userTotalDebt, userCollateralValue, accruedInterest } =
    userLendingInfo;

  let daiLeftToBorrow = BigNumber.from(0);
  let daiCanBorrow = BigNumber.from(0);

  if (
    userCollateralValue &&
    userTotalDebt &&
    userCollateralValue.gt(0) &&
    accruedInterest
  ) {
    daiLeftToBorrow = userCollateralValue
      .sub(userTotalDebt)
      .add(accruedInterest);
  }

  if (daiLeftToBorrow.isNegative()) {
    daiLeftToBorrow = BigNumber.from(0);
  }

  //  substract 5 minutes of interests
  if (yearlyPercentInterest && daiLeftToBorrow.gt(0)) {
    const accruedInterestInNext5Mins = daiLeftToBorrow
      .mul(yearlyPercentInterest)
      .div(BigNumber.from(100))
      .mul(BigNumber.from(300))
      .div(BigNumber.from(365 * 24 * 60 * 60));

    daiLeftToBorrow = daiLeftToBorrow.sub(accruedInterestInNext5Mins);
  }

  if (amount) {
    daiCanBorrow = collaterabilityOfToken
      ? collaterabilityOfToken.mul(BigNumber.from(parseEther(amount)))
      : BigNumber.from(0);
  }

  // setDAILeftToBorrow(_daiLeftToBorrow.add(_daiCanBorrow));
  daiLeftToBorrow = daiLeftToBorrow.add(daiCanBorrow);

  const { account } = useEthers();
  const tokenBalance =
    useTokenBalance(TokenInfos.get(collateralContext)?.address, account) ||
    BigNumber.from(0);

  const onReset = () => {
    setAmount("");
    setDaiAmount("");
  };

  return (
    <BlurryBox variant="inner" {...props}>
      <VStack spacing={{ base: "4", md: "6" }} alignItems="center">
        <VStack width="100%" spacing={{ base: "2", md: "4" }} alignItems="left">
          <Text fontSize="sm">Deposit Collateral</Text>
          <HStack>
            <TokenMenu onChangeCallback={onReset} />
            <TokenAmountInput
              size="lg"
              max={formatEther(tokenBalance)}
              tokenDecimals={18}
              value={amount}
              onUserInput={(input) => setAmount(input)}
              showMaxButton
            />
          </HStack>
          {Number(amount) > Number(formatEther(tokenBalance)) && (
            <Text fontSize={12} color="red.300">
              Insufficient funds
            </Text>
          )}
        </VStack>
        <Divider orientation="horizontal" />
        <VStack width="100%" spacing={{ base: "2", md: "4" }} alignItems="left">
          <Text fontSize="sm">Borrow DAI</Text>
          <HStack alignItems="center">
            <HStack width={{ base: "initial", md: "9rem" }}>
              <TokenMenuItemContent token={TokenInfos.get(TokenId.Dai)} />
            </HStack>
            <TokenAmountInput
              size="lg"
              max={formatEther(daiLeftToBorrow)}
              tokenDecimals={18}
              value={daiAmount}
              onUserInput={(input) => setDaiAmount(input)}
              showMaxButton
            />
          </HStack>
          {Number(daiAmount) > Number(formatEther(daiLeftToBorrow)) && (
            <>
              {Number(daiLeftToBorrow.gt(0)) ? (
                <Text fontSize={12} color="red.300">
                  Maximum borrow amount is{" "}
                  {formatNumber(formatEther(daiLeftToBorrow))} DAI
                </Text>
              ) : (
                <>
                  {Number(amount) === 0 && (
                    <Text fontSize={12} color="red.300">
                      Please deposit some collateral first.
                    </Text>
                  )}
                </>
              )}
            </>
          )}
        </VStack>
        {!account ? (
          <UserWallet />
        ) : (
          <BorrowButton
            amount={Number(amount)}
            tokenBalance={Number(formatEther(tokenBalance))}
            daiAmount={Number(daiAmount)}
            daiLeftToBorrow={daiLeftToBorrow}
            availableDai={Number(formatEther(userLendingInfo.availableDai))}
            onReset={onReset}
          />
        )}
      </VStack>
    </BlurryBox>
  );
};

const Repay = ({ ...props }) => {
  const [amount, setAmount] = useState("");
  const { collateralContext } = useCollateral();

  const collateralToken = TokenInfos.get(collateralContext);
  const collateralTokenValue = collateralToken?.value;

  const { account } = useEthers();
  const globalLendingStats = useGlobalLendingStats();
  const userLendingInfo = useUserLendingInfo();
  const block = useBlockMeta();

  const { yearlyPercentInterest, collaterabilityOfToken } = globalLendingStats;
  const { userTotalDebt, debtorSummary, userCollateralValue } = userLendingInfo;

  const timestamp = block.timestamp ? block.timestamp.getTime() / 1000 : 0;
  const timeLastBorrow =
    debtorSummary && debtorSummary.timeLastBorrow
      ? debtorSummary.timeLastBorrow
      : BigNumber.from(0);

  const timeSinceLastLoan = BigNumber.from(timestamp)
    .add(BigNumber.from(300)) // 5 mins
    .sub(timeLastBorrow);

  const amountDAIBorrowed =
    debtorSummary && debtorSummary.amountDAIBorrowed
      ? debtorSummary.amountDAIBorrowed
      : BigNumber.from(0);

  const fullAccruedInterest = yearlyPercentInterest
    ? amountDAIBorrowed
        .mul(yearlyPercentInterest)
        .div(BigNumber.from(100))
        .mul(timeSinceLastLoan)
        .div(BigNumber.from(365 * 24 * 60 * 60))
    : BigNumber.from(0);

  const daiBalance =
    useTokenBalance(DaiToken.address, account) || BigNumber.from(0);
  const totalDebt = amountDAIBorrowed.add(fullAccruedInterest);

  const tokenBalance =
    useTokenBalance(TokenInfos.get(collateralContext)?.address, account) ||
    BigNumber.from(0);

  const tokenNeedToRepay =
    collaterabilityOfToken && collaterabilityOfToken.gt(BigNumber.from(0))
      ? totalDebt.div(collaterabilityOfToken)
      : BigNumber.from(0);

  const { state: reclaimAllCollateralState, send: reclaimAllCollateral } =
    useContractFunction(LendingContract, "reclaimAllCollateral", {
      transactionName: "ReclaimAllCollateral",
    });

  const onReset = () => {
    setAmount("");
  };

  useEffect(() => {
    if (reclaimAllCollateralState.status === "Success") {
      onReset();
    }
  }, [reclaimAllCollateralState]);

  const onClaimAllCollateral = async () => {
    try {
      const tokenAddress = TokenInfos.get(collateralContext)?.address;

      if (tokenAddress) {
        await reclaimAllCollateral();
      }
    } catch (error: any) {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error);
      }
    }
  };

  return (
    <BlurryBox variant="inner" {...props}>
      <VStack spacing={{ base: "4", md: "6" }} alignItems="center">
        <VStack width="100%" spacing={{ base: "2", md: "4" }} alignItems="left">
          <Text fontSize="sm">Repay</Text>
          <HStack alignItems="center">
            <Flex width={{ base: "initial", md: "9rem" }}>
              <TokenMenu onChangeCallback={onReset} showAll />
            </Flex>
            <TokenAmountInput
              size="lg"
              tokenDecimals={18}
              max={formatEther(tokenNeedToRepay)}
              value={amount}
              onUserInput={(input) => setAmount(input)}
              showMaxButton
              disabled={
                userTotalDebt &&
                userTotalDebt.eq(BigNumber.from(0)) &&
                userCollateralValue &&
                userCollateralValue.gt(BigNumber.from(0))
              }
            />
          </HStack>
          {Number(amount) > Number(formatEther(tokenBalance)) && (
            <Text fontSize={12} color="red.300">
              Insufficient funds
            </Text>
          )}
        </VStack>
        {!account ? (
          <UserWallet />
        ) : (
          <HStack>
            {userTotalDebt &&
            userTotalDebt.eq(BigNumber.from(0)) &&
            userCollateralValue &&
            userCollateralValue.gt(BigNumber.from(0)) ? (
              <TransactionButton
                boxShadow={boxShadow}
                alignSelf="center"
                onClick={onClaimAllCollateral}
              >
                Claim All Collateral
              </TransactionButton>
            ) : (
              <RepayButton
                amount={Number(amount)}
                tokenBalance={Number(
                  formatEther(
                    collateralTokenValue === TokenId.Dai
                      ? daiBalance
                      : tokenBalance
                  )
                )}
                onReset={onReset}
              />
            )}
          </HStack>
        )}
      </VStack>
    </BlurryBox>
  );
};

export const SwapBox: FC<SwapBoxProps> = ({ type, ...props }) => {
  if (type === "borrow") {
    return <Borrow {...props} />;
  }

  return <Repay {...props} />;
};
