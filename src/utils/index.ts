import { parseEther } from "@ethersproject/units";
import { BigNumber } from "ethers";

export * from "./address";
export * from "./bigNumberishToNumber";
export * from "./convertChainIdToNetworkName";
export * from "./convertConnectorTypeToWalletName";
export * from "./format";
export * from "./formatLongNumbers";
export * from "./getEtherscanLink";
export * from "./groupBy";
export * from "./parseTransactionError";
export * from "./sanitize";
export * from "./tokenLogo";
export * from "./wait";

export const tryParseEther = (
  ether: string,
  defaultValue = BigNumber.from(0)
) => {
  try {
    return parseEther(ether);
  } catch (error) {
    return defaultValue;
  }
};
