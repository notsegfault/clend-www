import { Token, useEthers } from "@usedapp/core";
import { useCallback } from "react";

import { getTokenLogoURL } from "utils";

export const useAddTokenToMetaMask = (
  token: Token | undefined
): {
  addToken: () => void;
} => {
  const { chainId, library } = useEthers();

  const addToken = useCallback(async () => {
    if (
      library &&
      library.provider.isMetaMask &&
      library.provider.request &&
      token
    ) {
      await library.provider.request({
        method: "wallet_watchAsset",
        params: {
          // @ts-expect-error allow
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.ticker,
            decimals: token.decimals,
            image: getTokenLogoURL(token.address),
          },
        },
      });
    }
  }, [chainId, library, token]);

  return { addToken };
};
