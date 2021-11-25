import { ChainId, Token } from "@usedapp/core";
import { Contract } from "ethers";

export class TokenContract extends Token {
  constructor(
    name: string,
    ticker: string,
    readonly chainId: ChainId,
    readonly address: string,
    public contract: Contract
  ) {
    super(name, ticker, chainId, address);
  }
}
