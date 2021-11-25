/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
import { Tooltip, BoxProps, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

type Props = BoxProps;

export const InfoTooltip: React.FC<Props> = ({ children }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <Tooltip
      hasArrow
      placement="bottom"
      borderRadius="md"
      isOpen={isTooltipOpen}
      label={<>{children}</>}
    >
      <Box>
        <AiOutlineInfoCircle
          size="18px"
          onClick={() => setIsTooltipOpen(true)}
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
        />
      </Box>
    </Tooltip>
  );
};
