/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
import {
  Button,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Stack,
  Box,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import React from "react";

import { sanitize } from "utils/sanitize";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function removeExcessDecimals(string: string, tokenDecimals: number) {
  if (string.includes(".")) {
    const splitArray = string.split(".");
    const preDecimal = splitArray[0];
    const postDecimal = splitArray[1];
    const postDecimalLength = postDecimal.length;
    if (postDecimalLength <= tokenDecimals) {
      return string;
    }
    return `${preDecimal}.${postDecimal.substring(0, tokenDecimals)}`;
  }
  return string;
}

interface Props extends InputProps {
  max?: string;
  value: string;
  tokenDecimals: number;
  disabled?: boolean;
  showRadioGroup?: boolean;
  showMaxButton?: boolean;
  inputRightElement?: React.ReactElement;
  inputRef?: React.RefObject<HTMLInputElement>;
  onUserInput: (value: string) => void;
}

export const TokenAmountInput: React.FC<Props> = ({
  max = ethers.constants.MaxUint256.toString(),
  value,
  tokenDecimals,
  disabled,
  showMaxButton,
  inputRightElement,
  onUserInput,
  placeholder,
  inputRef,
  ...rest
}) => {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(removeExcessDecimals(nextUserInput, tokenDecimals));
    }
  };

  return (
    <Box flexGrow={1}>
      <InputGroup alignItems="center">
        <Input
          ref={inputRef}
          value={value}
          onChange={(event) => {
            enforcer(event.target.value.replace(/,/g, "."));
          }}
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder={placeholder || "0.0"}
          minLength={1}
          maxLength={76}
          disabled={disabled}
          spellCheck="false"
          isInvalid={parseUnits(sanitize(value), tokenDecimals).gt(
            parseUnits(max, tokenDecimals)
          )}
          {...(showMaxButton || inputRightElement ? { pr: "4rem" } : {})}
          {...rest}
        />
        {(showMaxButton || inputRightElement) && (
          <InputRightElement top="unset" width="auto" right="0.5rem">
            <Stack direction="row" alignItems="center">
              {showMaxButton && (
                <Button
                  disabled={disabled}
                  size="sm"
                  variant="outline"
                  onClick={() => onUserInput(max)}
                >
                  Max
                </Button>
              )}
              {inputRightElement}
            </Stack>
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
};
