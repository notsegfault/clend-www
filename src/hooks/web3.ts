/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
import { useEthers } from "@usedapp/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

import { injectedConnector as injected, networkConnector } from "connectors";

import { useModal } from "./useModal";

export const resetConnection = async (
  connector: AbstractConnector | undefined
) => {
  if (connector instanceof WalletConnectConnector) {
    connector.close();
    // eslint-disable-next-line no-param-reassign
    connector.walletConnectProvider = undefined;
    localStorage.removeItem("walletconnect");
  }
  if (connector instanceof WalletLinkConnector) {
    connector.close();
  }
};

export function useEagerConnect() {
  const { closeModal } = useModal();
  const { activate, active, connector } = useEthers();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        /* @ts-expect-error allow */
        // eslint-disable-next-line no-lonely-if
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  useEffect(() => {
    if (tried && !active) {
      activate(networkConnector, undefined, false);
    }
  }, [tried, active, activate]);

  useEffect(() => {
    if (connector && !(connector instanceof NetworkConnector)) {
      closeModal();
    }
  }, [connector]);

  return { tried };
}
