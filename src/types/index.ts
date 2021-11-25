export * from "./TokenContract";
export * from "./merge";
export * from "./modal";

export enum TokenId {
  Dai,
  Core,
  CoreDAO,
}

export interface TokenInfo {
  name: string;
  iconUrl: string;
  value: TokenId;
  collateral: boolean;
  address: string;
  isDisabled?: boolean;
}
