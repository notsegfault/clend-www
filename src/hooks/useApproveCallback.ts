import { parseEther } from "@ethersproject/units";
import {
  useEthers,
  useTokenAllowance,
  useContractFunction,
  TransactionStatus,
} from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import { useMemo, useCallback } from "react";

import { ERC20Interface } from "../abi";
import { LendingContract } from "../constants";

export enum ApprovalState {
  UNKNOWN = "UNKNOWN",
  NOT_APPROVED = "NOT_APPROVED",
  APPROVED = "APPROVED",
}

export const useApproveCallback = (
  tokenAddress: string | undefined,
  amountToApprove?: BigNumber,
  spender?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [ApprovalState, TransactionStatus, () => Promise<void>] => {
  const { account } = useEthers();
  const currentAllowance = useTokenAllowance(
    tokenAddress,
    account ?? undefined,
    spender
  );
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;

    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance || amountToApprove.toString() === "0")
      return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(amountToApprove)
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, spender]);

  const tokenContract = new Contract(tokenAddress ?? "", ERC20Interface);

  const { state, send } = useContractFunction(tokenContract, "approve");

  const approve = useCallback(
    async (): Promise<void> => {
      if (approvalState !== ApprovalState.NOT_APPROVED) {
        console.error("approve was called unnecessarily");
        return;
      }

      if (!tokenAddress) {
        console.error("no token");
        return;
      }

      if (!tokenContract) {
        console.error("tokenContract is null");
        return;
      }

      if (!amountToApprove) {
        console.error("missing amount to approve");
        return;
      }

      if (!spender) {
        console.error("no spender");
        return;
      }
      // eslint-disable-next-line consistent-return
      return send(
        LendingContract.address,
        parseEther(amountToApprove.toString())
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      approvalState,
      tokenAddress,
      tokenContract,
      amountToApprove,
      spender,
      currentAllowance,
    ]
  );

  return [approvalState, state, approve];
};
