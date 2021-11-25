import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import AppConfig from "config/app.config";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: AppConfig.supportedNetworks,
});

export const networkConnector = new NetworkConnector({
  urls: {
    1: AppConfig.networks[1].rpcUrl,
  },
  defaultChainId: 1,
});

export const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    1: AppConfig.networks[1].rpcUrl,
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
});

export const walletLinkConnector = new WalletLinkConnector({
  url: AppConfig.networks[1].rpcUrl,
  appName: AppConfig.appName,
});
