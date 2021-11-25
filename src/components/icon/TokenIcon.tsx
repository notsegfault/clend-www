import { Image, ImageProps } from "@chakra-ui/react";
import { FC } from "react";

import { TokenInfos } from "../../constants";
import { TokenId } from "../../types";

interface TokenIconProps extends ImageProps {
  tokenId: TokenId;
}

export const TokenIcon: FC<TokenIconProps> = ({ tokenId, ...props }) => {
  const tokenInfo = TokenInfos.get(tokenId);

  return (
    <Image
      boxSize="2rem"
      borderRadius="full"
      bgColor="white"
      border="1px solid white"
      boxShadow="0 0 1px 0 white inset, 0 0 1px 0 white"
      src={tokenInfo?.iconUrl}
      minWidth="24px"
      minHeight="24px"
      maxWidth="24px"
      maxHeight="24px"
      {...props}
    />
  );
};
