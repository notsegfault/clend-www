import {
  Flex,
  Spinner,
  useToast,
  Link,
  Image,
  Text,
  Box,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useEffect, useState } from "react";

import { injectedConnector } from "connectors";
import { resetConnection } from "hooks/web3";

type Props = {
  connector: AbstractConnector;
  title: string;
  src: string;
};

export const WalletSelectorBox = ({ connector, title, src }: Props) => {
  const toast = useToast();
  const { connector: activeConnector, activate, deactivate } = useEthers();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeConnector === connector) {
      setIsLoading(false);
    }
  }, [activeConnector, connector]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
      if (
        connector instanceof WalletConnectConnector &&
        connector.walletConnectProvider?.wc?.uri
      ) {
        // eslint-disable-next-line no-param-reassign
        connector.walletConnectProvider = undefined;
      }

      activate(connector, (err) => {
        if (!err) {
          setIsLoading(false);
        } else {
          toast({
            description: err.message || "Something went wrong",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom-right",
          });
          setIsLoading(false);
        }
      });
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    resetConnection(connector);
    deactivate();
  };

  const isActive = activeConnector === connector;
  return (
    <Box visible={isActive.toString()} borderRadius="xl">
      <Flex
        bg="gray.800"
        height="130px"
        alignItems="center"
        direction="column"
        onClick={isActive ? undefined : handleConnect}
        borderRadius="xl"
        borderWidth="1px"
        _hover={{
          backgroundColor: "gray.700",
          cursor: "pointer",
        }}
      >
        <Image margin="auto" mt={5} mb={2} w={12} h={12} src={src} />
        <Text textAlign="center">{title}</Text>
        {isLoading && <Spinner size="sm" ml={2} />}
        {/* @ts-expect-error allow */}
        {!(window.web3 || window.ethereum) && connector === injectedConnector && (
          <Link
            isExternal
            fontSize="sm"
            color="cyan.500"
            href="https://metamask.io/"
            onClick={(e) => e.stopPropagation()}
          >
            Install Metamask
          </Link>
        )}
        {isActive && activeConnector !== injectedConnector && (
          <Text fontSize="sm" textColor="gray.400" onClick={handleDisconnect}>
            Disconnect
          </Text>
        )}
      </Flex>
    </Box>
  );
};
