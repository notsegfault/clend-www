import {
  HStack,
  Button,
  chakra,
  IconButton,
  Spinner,
  Box,
} from "@chakra-ui/react";
import {
  getStoredTransactionState,
  useEthers,
  useTransactions,
} from "@usedapp/core";
import { getAddress } from "ethers/lib/utils";
import { FC } from "react";
import { VscLink } from "react-icons/vsc";

import { useModal } from "hooks/useModal";
import { ModalType } from "types";
import { truncate } from "utils/address";

export const UserWallet: FC = () => {
  const { account } = useEthers();
  const { openModal } = useModal();
  const { transactions } = useTransactions();

  const openWalletModal = () => {
    openModal(ModalType.ConnectWallet);
  };

  if (account) {
    return (
      <HStack>
        <IconButton
          aria-label="notifications"
          onClick={openWalletModal}
          size="md"
          icon={
            <>
              <Box px="4">{truncate(getAddress(account))}</Box>
              <chakra.span
                hidden={
                  transactions.filter(
                    (t) => getStoredTransactionState(t) === "Mining"
                  ).length <= 0
                }
                pos="absolute"
                top="0px"
                right="10px"
                px={1.5}
                py={1.5}
                fontSize="xs"
                fontWeight="bold"
                lineHeight="none"
                color="red.100"
                transform="translate(50%,-50%)"
                bg="green.600"
                rounded="full"
              >
                <HStack>
                  <Spinner size="xs" />
                </HStack>
              </chakra.span>
            </>
          }
        />
      </HStack>
    );
  }

  return (
    <>
      <Button
        display={{ base: "none", md: "flex" }}
        rightIcon={<VscLink />}
        onClick={openWalletModal}
      >
        CONNECT WALLET
      </Button>
      <Button
        size="sm"
        display={{ base: "flex", md: "none" }}
        fontSize="xs"
        onClick={openWalletModal}
      >
        CONNECT WALLET
      </Button>
    </>
  );
};
