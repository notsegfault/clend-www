/* eslint-disable no-restricted-properties */
/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Numeral from "numeral";

export const formatK = (value: string) => {
  return Numeral(value).format("0.[00]a");
};

// using a currency library here in case we want to add more in future
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatPercent(percentString: any) {
  const percent = parseFloat(percentString);
  if (!percent || percent === Infinity || percent === 0) {
    return "0%";
  }
  if (percent < 0.0001 && percent > 0) {
    return "< 0.0001%";
  }
  if (percent < 0 && percent > -0.0001) {
    return "< 0.0001%";
  }
  const fixedPercent = percent.toFixed(2);
  if (fixedPercent === "0.00") {
    return "0%";
  }
  if (Number(fixedPercent) > 0) {
    if (Number(fixedPercent) > 100) {
      return `${percent?.toFixed(0).toLocaleString()}%`;
    }
    return `${fixedPercent}%`;
  }
  return `${fixedPercent}%`;
}

export const formatNumber = (
  number: any,
  usd = false,
  scale = true,
  precision = 4
) => {
  if (Number.isNaN(number) || number === "" || number === undefined) {
    return usd ? "$0.00" : "0";
  }

  const num = parseFloat(number);

  if (num > 500000000 && scale) {
    return (usd ? "$" : "") + formatK(num.toFixed(0));
  }

  if (num === 0) {
    if (usd) {
      return "$0.00";
    }
    return "0";
  }

  if (num < 0.0001 && num > 0) {
    return usd ? "< $0.0001" : "< 0.0001";
  }

  if (num > 1000) {
    return usd
      ? `$${Number(parseFloat(String(num)).toFixed(0)).toLocaleString()}`
      : `${Number(parseFloat(String(num)).toFixed(0)).toLocaleString()}`;
  }

  if (usd) {
    if (num < 0.1) {
      return `$${Number(parseFloat(String(num)).toFixed(4))}`;
    }
    const usdString = priceFormatter.format(num);
    return `$${usdString.slice(1, usdString.length)}`;
  }

  return parseFloat(String(num)).toPrecision(precision);
};

export const formatUSD = (number: any) => {
  return formatNumber(number, true, false);
};
