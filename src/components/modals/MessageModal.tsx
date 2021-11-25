import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import { useModal } from "hooks/useModal";

export const MessageModal: FC<{ title: string; content: ReactNode }> = ({
  title,
  content,
}) => {
  const { closeModal, isOpen } = useModal();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent borderRadius="xl">
        <ModalHeader textAlign="center">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" py={8}>
          {content}
        </ModalBody>
        <ModalFooter>
          <Button isFullWidth onClick={() => closeModal()}>
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
