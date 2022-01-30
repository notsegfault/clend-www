import {
  Box,
  useRadio,
  useRadioGroup,
  HStack,
  Stack,
  UseRadioProps,
  UseRadioGroupProps,
} from "@chakra-ui/react";
import { FC } from "react";

const boxShadow =
  "2px 4px 12px rgba(0, 0, 0, 0.15), 0px 21px 53px rgba(77, 85, 195, 0.38), inset -2px -1px 8px rgba(255, 255, 255, 0.22)";

const RadioCard: FC<UseRadioProps> = ({ children, ...props }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        fontWeight="bold"
        cursor="pointer"
        _checked={{
          background:
            "linear-gradient(95.32deg, #2F55DE -18.91%, #EA5332 148.09%)",
          color: "white",
          boxShadow,
          borderRadius: "7px",
        }}
        px={8}
        py={3}
      >
        {children}
      </Box>
    </Box>
  );
};

export const BorrowRepayButton: FC<UseRadioGroupProps> = ({ ...props }) => {
  const options = ["borrow", "repay"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "action",
    defaultValue: "borrow",
    value: props.value,
    onChange: props.onChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      <Stack
        direction="row"
        p="2px"
        borderRadius="9px"
        background="linear-gradient(95.32deg, #2F55DE -18.91%, #EA5332 148.09%)"
      >
        <HStack borderRadius="8px" bgColor="rgb(41,42,61)" spacing="0" p="2px">
          {options.map((value) => {
            const radio = getRadioProps({ value });
            return (
              <RadioCard key={value} {...radio}>
                {value}
              </RadioCard>
            );
          })}
        </HStack>
      </Stack>
    </HStack>
  );
};
