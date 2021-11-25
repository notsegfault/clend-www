import {
  Box,
  Circle,
  HStack,
  Spinner,
  StackDivider,
  Tag,
  Text,
  Link as ChakraLink,
  VStack,
  Button,
} from "@chakra-ui/react";
import {
  DEFAULT_STORED_TRANSACTIONS,
  getStoredTransactionState,
  StoredTransaction,
  TransactionState,
  useEthers,
  useTransactions,
  useTransactionsContext,
} from "@usedapp/core";
import { nanoid } from "nanoid";
import { FC, useEffect, useState } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { HiCheck } from "react-icons/hi";
import { RiErrorWarningLine } from "react-icons/ri";

import { truncate } from "utils/address";
import { getEtherscanLink, EtherscanLinkType } from "utils/getEtherscanLink";

const convertTxnStatusToIcon = (status?: TransactionState) => {
  switch (status) {
    case "Fail":
    case "Exception":
      return <RiErrorWarningLine size="23px" color="rgba(229, 62, 62)" />;
    case "Success":
      return (
        <Circle size="22px" bg="gray.800">
          <HiCheck color="white" />
        </Circle>
      );
    case "Mining":
      return (
        <Spinner
          size="md"
          thickness="1px"
          color="gray.400"
          height="18px"
          width="18px"
        />
      );
    default:
      return <></>;
  }
};

export const TransactionList: FC = () => {
  const { transactions } = useTransactions();
  const { transactions: ctxTransactions } = useTransactionsContext();
  const { chainId } = useEthers();
  const [txnsToDisplay, setTxnsToDisplay] = useState<StoredTransaction[]>([]);

  useEffect(() => {
    setTxnsToDisplay(transactions.slice(0, 5));
  }, [transactions]);

  const getColorScheme = (status: TransactionState) => {
    switch (status) {
      case "Success":
        return "green";
      case "Fail":
        return "red";
      default:
        return "gray";
    }
  };

  const getColor = (status: TransactionState) => {
    switch (status) {
      case "Success":
        return "green.500";
      case "Fail":
        return "red.500";
      default:
        return "gray.400";
    }
  };

  const clearTransactions = async () => {
    if (!chainId) return;

    const len = ctxTransactions[chainId]?.length;
    ctxTransactions[chainId]?.splice(0, len);
    setTxnsToDisplay([]);
    localStorage.setItem(
      "transactions",
      JSON.stringify(DEFAULT_STORED_TRANSACTIONS)
    );
  };

  return (
    <Box>
      <HStack mb="4">
        <Text flex="1">Recent Transactions</Text>
        <Button onClick={clearTransactions} size="xs">
          clear
        </Button>
      </HStack>
      {chainId && txnsToDisplay.length > 0 ? (
        <VStack
          px={4}
          py={2}
          spacing={1}
          bg="gray.700"
          borderRadius="xl"
          align="stretch"
          divider={<StackDivider borderColor="gray.600" />}
        >
          {txnsToDisplay.map((txn: StoredTransaction) => {
            const status = getStoredTransactionState(txn);

            return (
              <HStack key={nanoid()} justifyContent="space-between">
                {txn.transaction.hash && (
                  <ChakraLink
                    isExternal
                    href={getEtherscanLink(
                      chainId,
                      txn.transaction.hash as string,
                      EtherscanLinkType.TRANSACTION
                    )}
                  >
                    <BiLinkExternal />
                  </ChakraLink>
                )}
                <HStack flex="1" justifyContent="space-between">
                  <Tag
                    size="sm"
                    color={getColor(status)}
                    colorScheme={getColorScheme(status)}
                    width="fit-content"
                    variant="subtle"
                    fontWeight="bold"
                    py={1}
                    px={3}
                    borderRadius="full"
                  >
                    {txn.transactionName ||
                      truncate(txn.transaction.hash, 10, 10)}
                  </Tag>

                  {convertTxnStatusToIcon(status)}
                </HStack>
              </HStack>
            );
          })}
        </VStack>
      ) : (
        <Text color="gray.400" fontSize="sm">
          Your transactions will appear here...
        </Text>
      )}
    </Box>
  );
};
