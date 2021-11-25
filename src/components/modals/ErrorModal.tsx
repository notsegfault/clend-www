import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { IoWarningOutline } from "react-icons/io5";

import { useModal } from "hooks/useModal";

export const ErrorModal: FC<{ title: string; content: ReactNode }> = ({
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
          <Flex justifyContent="center" color="red.400" pb={2}>
            <IoWarningOutline fontSize="56px" />
          </Flex>
          {content}
        </ModalBody>
        <ModalFooter>
          <Button isFullWidth onClick={() => closeModal()}>
            Dismiss
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
