import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

enum Wallet {
  NETWORKCONNECTOR = "Network",
  INJECTEDCONNECTOR = "MetaMask",
  WALLETCONNECTCONNECTOR = "WalletConnect",
  PORTISCONNECTOR = "Portis",
  WALLETLINKCONNECTOR = "Coinbase",
}

export const convertConnectorTypeToWalletName = (
  connector: AbstractConnector | undefined
): Wallet | undefined => {
  if (connector instanceof InjectedConnector) return Wallet.INJECTEDCONNECTOR;
  if (connector instanceof WalletConnectConnector)
    return Wallet.WALLETCONNECTCONNECTOR;
  if (connector instanceof WalletLinkConnector)
    return Wallet.WALLETLINKCONNECTOR;
  if (connector instanceof NetworkConnector) return Wallet.NETWORKCONNECTOR;

  throw new TypeError("unknown connector type");
};
