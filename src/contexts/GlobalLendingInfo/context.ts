/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from "ethers";
import { createContext } from "react";

interface GlobalLendingInfo {
  yearlyPercentInterest?: BigNumber;
  loanDefaultThresholdPercent?: BigNumber;
  collaterabilityOfToken?: BigNumber;
  totalAmountDAIBorrowed?: BigNumber;
  totalInterestAccrued?: BigNumber;
  totalLendingPositions?: BigNumber;
  coreDaoLendingTVL?: BigNumber;
  coreLendingTVL?: BigNumber;
  coreDaoLendingPositions?: BigNumber;
  coreLendingPositions?: BigNumber;
}

export const GlobalLendingInfoContext = createContext<GlobalLendingInfo>({});
