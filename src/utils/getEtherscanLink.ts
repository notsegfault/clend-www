import { ChainId } from "@usedapp/core";

const ETHERSCAN_PREFIXES: { [chainId: number]: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Ropsten]: "ropsten.",
  [ChainId.Rinkeby]: "rinkeby.",
  [ChainId.Goerli]: "goerli.",
  [ChainId.Kovan]: "kovan.",
};

export enum EtherscanLinkType {
  TRANSACTION = "transaction",
  ADDRESS = "address",
  BLOCK = "block",
}

export function getEtherscanLink(
  chainId = 1,
  value: string,
  type: EtherscanLinkType
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] ?? ""}etherscan.io`;

  switch (type) {
    case EtherscanLinkType.TRANSACTION:
      return `${prefix}/tx/${value}`;
    case EtherscanLinkType.ADDRESS:
      return `${prefix}/address/${value}`;
    case EtherscanLinkType.BLOCK:
      return `${prefix}/block/${value}`;
    default:
      return `${prefix}`;
  }
}
