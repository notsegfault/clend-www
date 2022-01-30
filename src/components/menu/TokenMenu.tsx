/* eslint-disable react/no-array-index-key */
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  HStack,
  Container,
  BoxProps,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { FC, useState } from "react";

import { TokenInfos } from "../../constants";
import { useCollateral } from "../../hooks";
import { TokenId, TokenInfo } from "../../types";
import { TokenIcon } from "../icon/TokenIcon";

const tokenList = Array.from(TokenInfos.values());

export const TokenMenuItemContent: FC<{
  token?: TokenInfo;
  showMenuLabel?: boolean;
}> = ({ token, showMenuLabel }) => {
  if (!token) {
    return <></>;
  }

  return (
    <HStack>
      <TokenIcon mr="2" tokenId={token.value} />
      <Text display={showMenuLabel ? "flex" : { base: "none", md: "flex" }}>
        {token.name}
      </Text>
    </HStack>
  );
};

interface TokenMenuProps extends BoxProps {
  onChangeCallback?: () => void;
  showAll?: boolean;
}

export const TokenMenu: FC<TokenMenuProps> = ({ ...props }) => {
  const { collateralContext, setCollateralContext } = useCollateral();
  const [tokenId, setTokenId] = useState<TokenId>(collateralContext);
  const onSelect = (id: TokenId) => {
    setTokenId(id);
    setCollateralContext(id);

    if (props.onChangeCallback) {
      props.onChangeCallback();
    }
  };

  const subTokenList = props.showAll
    ? [...tokenList]
    : tokenList.filter((t) => t.collateral);

  return (
    <Menu {...props} autoSelect={false}>
      <MenuButton h={12}>
        <HStack spacing={[0, 0, 2]} width={{ base: "initial", md: "9rem" }}>
          {!props.showAll && !TokenInfos.get(tokenId)?.collateral ? (
            <TokenMenuItemContent token={TokenInfos.get(TokenId.Core)} />
          ) : (
            <TokenMenuItemContent token={TokenInfos.get(tokenId)} />
          )}
          <ChevronDownIcon boxSize={6} />
        </HStack>
      </MenuButton>
      <MenuList background="#303042" zIndex="999">
        {subTokenList.map((t) => (
          <Container p="0" key={nanoid()}>
            <MenuItem
              isDisabled={t.isDisabled}
              onClick={() => onSelect(t.value)}
            >
              <TokenMenuItemContent
                token={TokenInfos.get(t.value)}
                showMenuLabel
              />
            </MenuItem>
          </Container>
        ))}
      </MenuList>
    </Menu>
  );
};
