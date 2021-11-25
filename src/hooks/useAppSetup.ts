import { useEthers } from "@usedapp/core";
import { useEffect } from "react";

import { useEagerConnect } from "./web3";

export const useAppSetup = () => {
  const { account, chainId } = useEthers();
  const { tried } = useEagerConnect();

  useEffect(() => {
    if (account) {
      // Some initialization once account is known.
    }
  }, [chainId, account]);

  return { tried };
};
