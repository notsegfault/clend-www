import { FC } from "react";

import { ConfirmModal } from "components/modals/ConfirmModal";
import { ConnectWalletModal } from "components/modals/ConnectWalletModal";
import { ErrorModal } from "components/modals/ErrorModal";
import { MessageModal } from "components/modals/MessageModal";
import { useModal } from "hooks/useModal";
import { ModalType } from "types";

export const ModalRoot: FC = () => {
  const { modalType, modalProps } = useModal();

  switch (modalType) {
    case ModalType.ConnectWallet:
      return <ConnectWalletModal />;
    case ModalType.Error:
      return <ErrorModal {...modalProps} />;
    case ModalType.Confirm:
      return <ConfirmModal {...modalProps} />;
    case ModalType.Message:
      return <MessageModal {...modalProps} />;
    default:
      return <></>;
  }
};
