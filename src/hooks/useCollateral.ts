import { useContext } from "react";

import { CollateralContext } from "contexts/CollateralContext";

export const useCollateral = () => useContext(CollateralContext);
