import { FC, ReactNode, useState } from "react";

import { TokenId } from "../../types";

import { CollateralContext } from "./context";

export const CollateralProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collateralContext, setCollateralContext] = useState(TokenId.CoreDAO);

  return (
    <CollateralContext.Provider
      value={{ collateralContext, setCollateralContext }}
    >
      {children}
    </CollateralContext.Provider>
  );
};
