import { useDisclosure } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";

import { ModalResponse, ModalType } from "types";

import { ModalContext, ModalState } from "./context";

export interface InternalModalState extends ModalState {
  modalType: ModalType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalProps: any;
  resolve?: (modalResponse: ModalResponse) => void;
}

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modal, setModal] = useState<InternalModalState>({
    modalType: ModalType.None,
    modalProps: {},
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = async (modalType: ModalType, modalProps?: any) => {
    return new Promise<ModalResponse>((resolve) => {
      setModal({
        modalType,
        modalProps,
        resolve,
      });
      onOpen();
    });
  };

  const closeModal = (modalResponse: ModalResponse = ModalResponse.Ok) => {
    if (modal.resolve) {
      modal.resolve(modalResponse);
    }

    onClose();
  };

  return (
    <ModalContext.Provider
      value={{
        ...modal,
        isOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
