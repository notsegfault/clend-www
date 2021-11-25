import {
  Button,
  ButtonProps,
  Spinner,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import {
  useContractFunction,
  useEthers,
  useTokenAllowance,
  useTokenBalance,
} from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { FC } from "react";

import { ERC20Interface } from "../../abi/ERC20Interface";
import { TokenContract } from "types";

const PhonyContract = new ethers.Contract(
  ethers.constants.AddressZero,
  ERC20Interface
);

interface Props extends ButtonProps {
  token?: TokenContract;
  spenderAddress?: string;
}

export const TransactionButton: FC<Props> = ({
  token = undefined,
  spenderAddress = undefined,
  children,
  ...props
}) => {
  const { account } = useEthers();
  const tokenBalance =
    useTokenBalance(token?.contract.address, account) || BigNumber.from(0);
  const allowance = useTokenAllowance(
    token?.contract.address,
    account,
    spenderAddress
  );
  const { state, send } = useContractFunction(
    token?.contract || PhonyContract,
    "approve",
    {
      transactionName: `Approving ${token?.name}`,
    }
  );
  const [approvingTx, setApprovingTx] = useBoolean(false);
  const [sendingTx, setSendingTx] = useBoolean(false);

  const approve = async () => {
    setApprovingTx.on();
    try {
      await send(spenderAddress, ethers.constants.MaxUint256);
    } finally {
      setApprovingTx.off();
    }
  };

  const sendTx = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onClick) {
      setSendingTx.on();
      try {
        await props.onClick(e);
      } finally {
        setSendingTx.off();
      }
    }
  };

  if (spenderAddress && allowance?.lt(tokenBalance)) {
    return (
      <Button
        isDisabled={
          state.status === "Mining" || approvingTx || props?.isDisabled
        }
        {...props}
        onClick={approve}
      >
        {state.status === "Mining" || approvingTx ? (
          <Spinner size="md" />
        ) : (
          <Text>Approve {token?.name}</Text>
        )}
      </Button>
    );
  }
  return (
    <Button
      isDisabled={sendingTx || props?.isDisabled}
      {...props}
      onClick={sendTx}
    >
      {sendingTx ? <Spinner size="md" /> : <>{children}</>}
    </Button>
  );
};
