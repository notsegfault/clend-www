import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

import { NavBar } from "components/layout/NavBar";
import { ModalRoot } from "components/modals/ModalRoot";
import { useAppSetup } from "hooks/useAppSetup";

import { Footer } from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  useAppSetup();
  return (
    <Box
      maxW="1024px"
      margin="0 auto"
      pt={{ sm: "2", md: "2", lg: "6" }}
      px={{ base: "3", sm: "2" }}
      transition="0.5s ease-out"
      position={{ base: "relative", sm: "initial" }}
      overflowX="hidden"
    >
      <ModalRoot />
      <NavBar />
      <Box as="main" marginY={22}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
