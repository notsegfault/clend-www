/* eslint-disable no-param-reassign */
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits, isBytes } from "ethers/lib/utils";

export function bigNumberishToNumber(
  value: BigNumberish,
  units?: number | string
): number {
  if (isBytes(value)) {
    throw new Error("bigNumberishToNumber: Bytes not supported");
  }
  if (BigNumber.isBigNumber(value)) {
    value = formatUnits(value, units);
  }
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  return value as number;
}
