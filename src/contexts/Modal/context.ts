/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

import { ModalResponse, ModalType } from "types";

export interface ModalState {
  modalType: ModalType;
  modalProps: any;
}

interface ModalContextType extends ModalState {
  isOpen: boolean;

  openModal: (modalType: ModalType, modalProps?: any) => Promise<ModalResponse>;
  closeModal: (modalResponse?: ModalResponse) => void;
}

const initialState: ModalContextType = {
  isOpen: false,
  modalType: ModalType.None,
  modalProps: {},
  openModal(): Promise<ModalResponse> {
    throw new Error("openModal not initialized");
  },
  closeModal(): void {
    throw new Error("closeModal not initialized");
  },
};

export const ModalContext = createContext<ModalContextType>(initialState);
