import { useEthers } from "@usedapp/core";
import { useMemo } from "react";

import {
  injectedConnector,
  walletConnectConnector,
  walletLinkConnector,
} from "connectors";

export const useConnectedWalletName = () => {
  const { active, connector } = useEthers();

  return useMemo(() => {
    if (active) {
      if (connector === injectedConnector) {
        return "Metamask";
      }
      if (connector === walletConnectConnector) {
        return "WalletConnect";
      }
      if (connector === walletLinkConnector) {
        return "Coinbase";
      }
    }
    return null;
  }, [connector, active]);
};
