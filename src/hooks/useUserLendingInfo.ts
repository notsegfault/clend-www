import { useContext } from "react";

import { UserLendingInfoContext } from "contexts/UserLendingInfo";

export const useUserLendingInfo = () => useContext(UserLendingInfoContext);
