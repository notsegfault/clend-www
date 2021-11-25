/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContractCalls, useEthers, useTokenBalance } from "@usedapp/core";
import { BigNumber } from "ethers";
import { FC, ReactNode } from "react";

import { DaiToken, LendingContract } from "../../constants";
import { LendingInterface } from "abi";

import { UserLendingInfoContext } from "./context";

export const UserLendingInfoProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { account } = useEthers();

  const availableDai = useTokenBalance(
    DaiToken.address,
    LendingContract.address
  );

  const [
    userCollateralValue,
    userTotalDebt,
    debtorSummary,
    userCollaterals,
    accruedInterest,
  ] =
    useContractCalls(
      account
        ? [
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "userCollateralValue",
              args: [account],
            },
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "userTotalDebt",
              args: [account],
            },
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "debtorSummary",
              args: [account],
            },
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "userCollaterals",
              args: [account],
            },
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "accruedInterest",
              args: [account],
            },
          ]
        : []
    ) ?? [];
  return (
    <UserLendingInfoContext.Provider
      value={{
        userCollateralValue: (userCollateralValue || [])[0] as BigNumber,
        userTotalDebt: (userTotalDebt || [])[0] as BigNumber,
        debtorSummary: {
          timeLastBorrow: debtorSummary
            ? // @ts-ignore
              (debtorSummary.timeLastBorrow as BigNumber)
            : BigNumber.from(0),
          amountDAIBorrowed: debtorSummary
            ? // @ts-ignore
              (debtorSummary.amountDAIBorrowed as BigNumber)
            : BigNumber.from(0),
        },
        userCollaterals: (userCollaterals || [])[0],
        accruedInterest: (accruedInterest || [])[0] as BigNumber,
        availableDai: availableDai || BigNumber.from(0),
      }}
    >
      {children}
    </UserLendingInfoContext.Provider>
  );
};
