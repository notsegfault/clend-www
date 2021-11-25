import { Flex, BoxProps } from "@chakra-ui/react";
import { FC } from "react";

import { TokenId } from "../../types";

import { TokenIcon } from "./TokenIcon";

interface TokenPairIconProps extends BoxProps {
  tokenId1: TokenId;
  tokenId2: TokenId;
}
export const TokenPairIcon: FC<TokenPairIconProps> = ({
  tokenId1,
  tokenId2,
  ...props
}) => {
  return (
    <Flex {...props} position="relative" left="-12px">
      <TokenIcon position="relative" left="12px" tokenId={tokenId1} />
      <TokenIcon tokenId={tokenId2} />
    </Flex>
  );
};
