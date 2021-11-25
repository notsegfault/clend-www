import { createContext } from "react";

import { TokenId } from "../../types";

type CollateralContextType = {
  collateralContext: TokenId;
  setCollateralContext: (c: TokenId) => void;
};

export const CollateralContext = createContext<CollateralContextType>({
  collateralContext: TokenId.Core,
  setCollateralContext: () => {},
});
