/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContractCalls, useEthers, useTokenBalance } from "@usedapp/core";
import { BigNumber } from "ethers";
import { useRouter } from "next/dist/client/router";
import { FC, ReactNode, useEffect } from "react";

import { DaiToken, LendingContract } from "../../constants";
import { LendingInterface } from "abi";

import { UserLendingInfoContext } from "./context";

export const UserLendingInfoProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { account } = useEthers();
  const router = useRouter();
  const { a: queryAccount } = router.query;

  const availableDai = useTokenBalance(
    DaiToken.address,
    LendingContract.address
  );

  useEffect(() => {
    if (account) {
      router.push(`/?a=${account}`, undefined, { shallow: true });
    }
  }, [account]);

  const [
    userCollateralValue,
    userTotalDebt,
    debtorSummary,
    userCollaterals,
    accruedInterest,
  ] =
    useContractCalls(
      account || queryAccount
        ? [
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "userCollateralValue",
              args: [account || queryAccount],
            },
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "userTotalDebt",
              args: [account || queryAccount],
            },
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "debtorSummary",
              args: [account || queryAccount],
            },
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "userCollaterals",
              args: [account || queryAccount],
            },
            {
              abi: LendingInterface,
              address: LendingContract.address,
              method: "accruedInterest",
              args: [account || queryAccount],
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
