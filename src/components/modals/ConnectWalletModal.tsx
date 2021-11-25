/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { FC } from "react";
import { isMobile } from "react-device-detect";

import { ConnectedWalletInfoBar } from "components/connectWallet/InfoBar";
import { TransactionList } from "components/transactions";
import { WalletSelectorBox } from "components/wallet/WalletSelectorBox";
import {
  injectedConnector,
  walletConnectConnector,
  walletLinkConnector,
} from "connectors";
import { useModal } from "hooks/useModal";
import CoinbaseLogo from "img/wallets/coinbase-logo.svg";
import MMLogo from "img/wallets/metamask-logo.svg";
import WalletConnectLogo from "img/wallets/walletconnect-logo.svg";

const WalletOptions: FC = () => {
  return (
    <SimpleGrid columns={2} spacing="20px">
      {!isMobile && (
        <WalletSelectorBox
          connector={injectedConnector}
          title="MetaMask"
          src={MMLogo}
        />
      )}
      <WalletSelectorBox
        connector={walletConnectConnector}
        title="WalletConnect"
        src={WalletConnectLogo}
      />
      <WalletSelectorBox
        connector={walletLinkConnector}
        title="Coinbase"
        src={CoinbaseLogo}
      />
    </SimpleGrid>
  );
};

const Content: FC<{ active: boolean; account: any }> = ({
  active,
  account,
}) => {
  if (active && account) {
    return (
      <>
        <ConnectedWalletInfoBar />
        <TransactionList />
      </>
    );
  }

  return <WalletOptions />;
};

export const ConnectWalletModal: FC = () => {
  const { closeModal, isOpen } = useModal();
  const { active, account } = useEthers();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size={isMobile ? "full" : "md"}
      scrollBehavior={isMobile ? "inside" : "outside"}
    >
      <ModalOverlay />
      <ModalContent
        borderRadius={isMobile ? "none" : "xl"}
        mt={isMobile ? 0 : undefined}
      >
        <ModalHeader>
          <Text>{active && account ? "Account" : "Connect Wallet"}</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Content active={active} account={account} />
        </ModalBody>
        <ModalFooter justifyContent="center" />
      </ModalContent>
    </Modal>
  );
};
