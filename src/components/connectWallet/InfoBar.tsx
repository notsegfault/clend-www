/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  useClipboard,
  HStack,
  Tooltip,
  useToast,
  Text,
  Link,
  IconButton,
  Box,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { getAddress } from "ethers/lib/utils";
import { useEffect } from "react";
import Blockies from "react-blockies";
import { BiLinkExternal } from "react-icons/bi";
import { FiCopy } from "react-icons/fi";

import { useConnectedWalletName } from "hooks/useConnectedWalletName";
import { resetConnection } from "hooks/web3";
import { truncate } from "utils/address";
import { getEtherscanLink, EtherscanLinkType } from "utils/getEtherscanLink";

export const ConnectedWalletInfoBar = () => {
  const toast = useToast();
  const { account, chainId, connector, deactivate } = useEthers();
  const { hasCopied, onCopy } = useClipboard(account || "");
  const walletName = useConnectedWalletName();

  const handleDisconnect = async () => {
    resetConnection(connector);
    deactivate();
  };

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: `Copied ${walletName} address`,
        status: "info",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }, [hasCopied]);

  return (
    <HStack
      mb={5}
      px={2}
      py={2}
      border="1px"
      borderRadius="xl"
      borderColor="gray.700"
    >
      <Stack direction={["column", "row"]} alignItems="center">
        <HStack>
          <Box ml={2} borderRadius="xl" overflow="hidden">
            {account && <Blockies seed={account} size={8} scale={3} />}
          </Box>

          <Text fontSize="lg">{truncate(getAddress(account!))}</Text>
          <Tooltip label="Copy Address" placement="top" hasArrow>
            <IconButton
              isRound
              size="sm"
              bg="whiteAlpha.50"
              variant="ghost"
              aria-label="copy"
              onClick={onCopy}
              icon={<FiCopy />}
            />
          </Tooltip>
          <Tooltip label="View Etherscan" placement="top" hasArrow>
            <IconButton
              isRound
              size="sm"
              bg="whiteAlpha.50"
              variant="ghost"
              aria-label="copy"
              onClick={onCopy}
              icon={<BiLinkExternal />}
              as={Link}
              isExternal
              href={getEtherscanLink(
                chainId,
                account || "",
                EtherscanLinkType.ADDRESS
              )}
            />
          </Tooltip>
        </HStack>
        <HStack alignContent="left">
          <Button size="xs" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </HStack>
      </Stack>
    </HStack>
  );
};
