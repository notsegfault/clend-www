import { useToast } from "@chakra-ui/react";
import { TransactionStatus } from "@usedapp/core";
import { useEffect } from "react";

/* eslint-disable default-case */
export const useTransactionState = (state?: TransactionStatus | undefined) => {
  const toast = useToast();

  useEffect(() => {
    switch (state?.status) {
      case "Fail":
      case "Exception":
        toast({
          description: state.errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        break;
    }
  }, [state]);
};
