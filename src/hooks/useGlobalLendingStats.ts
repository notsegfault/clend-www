import { useContext } from "react";

import { GlobalLendingInfoContext } from "contexts/GlobalLendingInfo";

export const useGlobalLendingStats = () => useContext(GlobalLendingInfoContext);
