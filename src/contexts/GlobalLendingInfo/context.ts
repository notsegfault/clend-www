/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from "ethers";
import { createContext } from "react";

import { Apy } from "../../types";

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
  availableDaiToBorrow?: BigNumber;
  stakingApy?: Apy;
}

export const GlobalLendingInfoContext = createContext<GlobalLendingInfo>({});
