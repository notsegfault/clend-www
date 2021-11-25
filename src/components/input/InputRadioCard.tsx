/* eslint-disable react/destructuring-assignment */
import { Box, useRadio, UseRadioProps } from "@chakra-ui/react";
import { FC } from "react";

export const InputRadioCard: FC<UseRadioProps> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" flexGrow={1}>
      <input {...input} />
      <Box
        {...checkbox}
        color="gray.400"
        cursor="pointer"
        borderWidth="1px"
        boxShadow="md"
        borderRadius="xl"
        textAlign="center"
        _checked={{
          color: "white",
          borderColor: "cyan.400",
        }}
        py={1}
      >
        {props.children}
      </Box>
    </Box>
  );
};
