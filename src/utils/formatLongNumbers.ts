import numeral from "numeral";

export const formatLongNumbers = (number: number, format = "(0.[00]a)") => {
  if (number < 0.00001) return format.includes("%") ? "0%" : 0;
  return numeral(number).format(format);
};
