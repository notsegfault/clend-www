import { useContractCalls } from "@usedapp/core";
import { BigNumber } from "ethers";
import { FC, ReactNode } from "react";

import { TokenInfos, LendingContract, DaiContract } from "../../constants";
import { useCollateral } from "../../hooks/useCollateral";
import { LendingInterface, ERC20Interface } from "abi";

import { GlobalLendingInfoContext } from "./context";

export const GlobalLendingInfoProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { collateralContext } = useCollateral();
  const tokenAddress = TokenInfos.get(collateralContext)?.address;

  const [
    yearlyPercentInterest,
    loanDefaultThresholdPercent,
    collaterabilityOfToken,
    availableDaiToBorrow,
  ] =
    useContractCalls([
      {
        abi: LendingInterface,
        address: LendingContract.address,
        method: "yearlyPercentInterest",
        args: [],
      },
      {
        abi: LendingInterface,
        address: LendingContract.address,
        method: "loanDefaultThresholdPercent",
        args: [],
      },
      {
        abi: LendingInterface,
        address: LendingContract.address,
        method: "collaterabilityOfToken",
        args: [tokenAddress || ""],
      },
      {
        abi: ERC20Interface,
        address: DaiContract.address,
        method: "balanceOf",
        args: [LendingContract.address],
      },
    ]) ?? [];

  return (
    <GlobalLendingInfoContext.Provider
      value={{
        yearlyPercentInterest: (yearlyPercentInterest || [])[0] as BigNumber,
        loanDefaultThresholdPercent: (loanDefaultThresholdPercent ||
          [])[0] as BigNumber,
        collaterabilityOfToken: (collaterabilityOfToken || [])[0] as BigNumber,
        availableDaiToBorrow: (availableDaiToBorrow || [])[0] as BigNumber,
      }}
    >
      {children}
    </GlobalLendingInfoContext.Provider>
  );
};
