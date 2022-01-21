/* eslint-disable sonarjs/no-redundant-boolean */
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Container,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  HStack,
  Tooltip,
  IconButton,
  Stack,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import NextLink from "next/link";
import { ReactNode } from "react";

import { CoreToken } from "../../constants";
import { useAddTokenToMetaMask } from "../../hooks/useAddTokenToMetaMask";
import { getTokenLogoURL } from "../../utils";
import { UserWallet } from "components/user/UserWallet";

const Links = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Governance",
    items: [
      {
        label: "(Coming Soon)",
        href: "#",
        disabled: true,
      },
      /* {
        label: "Snapshot (off-chain voting)",
        href: "#",
        disabled: true,
      },
      {
        label: "WithTally (on-chain voting)",
        href: "#",
        disabled: true,
      },
      {
        label: "Forum",
        href: "#",
      }, */
    ],
  },
];

const NavItem = ({ children }: { children: ReactNode }) => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <Box
    px={2}
    py={1}
    rounded="md"
    userSelect="none"
    _hover={{
      textDecoration: "none",
      bg: "gray.700",
    }}
  >
    {children}
  </Box>
);

const NavItems = () => {
  return (
    <>
      {Links.map(({ label, href, items = [] }) => (
        <NavItem key={label}>
          {items.length === 0 ? (
            <NextLink href={href || "#"}>{label}</NextLink>
          ) : (
            <Menu>
              <MenuButton>{label}</MenuButton>
              <MenuList zIndex="999">
                {items.map(({ label: itemLabel, href: itemHref, disabled }) => (
                  <Container p="0" key={nanoid()}>
                    <MenuItem>
                      {disabled ? (
                        <Box color="gray.500">{itemLabel}</Box>
                      ) : (
                        <NextLink href={itemHref || "#"}>{itemLabel}</NextLink>
                      )}
                    </MenuItem>
                  </Container>
                ))}
              </MenuList>
            </Menu>
          )}
        </NavItem>
      ))}
    </>
  );
};

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { account } = useEthers();
  const { addToken: addCoreToken } = useAddTokenToMetaMask(CoreToken);

  return (
    <>
      <Box>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={{ base: "2", md: "0" }}>
            <IconButton
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Open Menu"
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <Box width={{ base: "120px", sm: "140px" }}>
              <Image src="/logo.svg" />
            </Box>
            <HStack
              as="nav"
              spacing={4}
              pl="4"
              display={{ base: "none", md: "flex" }}
            >
              <NavItems />
            </HStack>
          </HStack>
          <Flex>
            {false && (
              <Box mr="4" display={{ base: "none", md: "flex" }}>
                <Tooltip
                  label="Add CORE to Metamask"
                  placement="bottom"
                  hasArrow
                >
                  <IconButton
                    size="md"
                    aria-label="add core token"
                    icon={
                      <Image
                        onClick={addCoreToken}
                        alt="CORE"
                        filter="grayscale(100%)"
                        cursor="pointer"
                        boxSize="32px"
                        src={getTokenLogoURL(CoreToken.contract.address)}
                      />
                    }
                  />
                </Tooltip>
              </Box>
            )}
            <Box>
              <UserWallet />
            </Box>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              <NavItems />
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
