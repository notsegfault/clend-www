/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from "ethers";
import { createContext } from "react";

interface UserLendingInfo {
  // Directly obtained from the contract
  userCollateralValue?: BigNumber;
  userTotalDebt?: BigNumber;
  debtorSummary?: { timeLastBorrow: BigNumber; amountDAIBorrowed: BigNumber };
  userCollaterals?: any[];
  accruedInterest?: BigNumber;
  availableDai: BigNumber;
}

export const UserLendingInfoContext = createContext<UserLendingInfo>({
  availableDai: BigNumber.from(0),
});
