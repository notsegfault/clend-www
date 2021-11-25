/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useToast,
  Box,
  Link as ChakraLink,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useEthers, useNotifications } from "@usedapp/core";
import { nanoid } from "nanoid";
import { FC, ReactNode, useEffect } from "react";
import { BiLinkExternal } from "react-icons/bi";

import { truncate } from "utils/address";
import { getEtherscanLink, EtherscanLinkType } from "utils/getEtherscanLink";

import { NotificationContext } from "./context";

const transactionTypeToToastType = (notification: any) => {
  switch (notification.type) {
    case "transactionStarted":
      return "info";
    case "transactionSucceed":
      return "success";
    case "transactionFailed":
      return "error";
    default:
      return "info";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTransactionNotification = (notification: any) =>
  notification.type === "transactionStarted" ||
  notification.type === "transactionSucceed" ||
  notification.type === "transactionFailed";

const NotificationContent: FC<{ notification: any }> = ({ notification }) => {
  const { chainId } = useEthers();
  let title = "";
  let description = "";

  switch (notification.type) {
    case "transactionStarted":
      title = "Transaction Started";
      description = notification.transactionName;
      break;
    case "transactionSucceed":
      title = "Transaction Succeed";
      description = notification.transactionName;
      break;
    case "transactionFailed":
      title = "Transaction Failed";
      description = notification.transactionName;
      break;
    default:
      break;
  }

  return (
    <Box>
      <Text fontSize="sm">{title}</Text>
      <Text fontSize="xs">{description}</Text>

      <ChakraLink
        isExternal
        fontSize="xs"
        href={getEtherscanLink(
          chainId,
          notification.transaction.hash as string,
          EtherscanLinkType.TRANSACTION
        )}
      >
        <HStack>
          <Box>{truncate(notification.transaction.hash, 10, 10)}</Box>
          <BiLinkExternal />
        </HStack>
      </ChakraLink>
    </Box>
  );
};

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { notifications, removeNotification } = useNotifications();
  const { chainId } = useEthers();
  const toast = useToast();

  useEffect(() => {
    if (!chainId) return;

    notifications
      .filter((n) => isTransactionNotification(n))
      .forEach((n) => {
        const notification = n as any;
        toast({
          id: `${notification.transaction.hash}-${nanoid()}`,
          description: <NotificationContent notification={notification} />,
          status: transactionTypeToToastType(notification),
          duration: 10000,
          isClosable: true,
          position: "bottom-right",
        });

        removeNotification({ notificationId: n.id, chainId });
      });
  }, [notifications, chainId]);

  return (
    <NotificationContext.Provider value={undefined}>
      {children}
    </NotificationContext.Provider>
  );
};
