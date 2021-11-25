import { useContext } from "react";

import { ModalContext } from "contexts/Modal";

export const useModal = () => useContext(ModalContext);
