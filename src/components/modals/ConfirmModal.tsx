import {
  Box,
  Button,
  Flex,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  ModalCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@chakra-ui/react";
import { FC, ReactNode, useRef } from "react";
import { BsQuestionCircle } from "react-icons/bs";

import { useModal } from "hooks/useModal";
import { ModalResponse } from "types";

export const ConfirmModal: FC<{ title: string; content: ReactNode }> = ({
  title,
  content,
}) => {
  const { closeModal, isOpen } = useModal();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cancelRef = useRef<any>();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => closeModal(ModalResponse.Cancel)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent borderRadius="xl">
          <AlertDialogHeader textAlign="center">{title}</AlertDialogHeader>
          <ModalCloseButton />
          <AlertDialogBody textAlign="center" py={8}>
            <Flex justifyContent="center" pb={2}>
              <BsQuestionCircle fontSize="56px" />
            </Flex>
            {content}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Flex flex="1" pb={2}>
              <Box flex="1" mr="4">
                <Button
                  isFullWidth
                  onClick={() => closeModal(ModalResponse.Ok)}
                >
                  Ok
                </Button>
              </Box>
              <Box flex="1">
                <Button
                  isFullWidth
                  ref={cancelRef}
                  onClick={() => closeModal(ModalResponse.Cancel)}
                >
                  Cancel
                </Button>
              </Box>
            </Flex>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
