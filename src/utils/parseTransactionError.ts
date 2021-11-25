const containsAny = (str: string, substrings: string[]): string | null => {
  for (let i = 0; i !== substrings.length; i += 1) {
    const substring = substrings[i];
    if (str.indexOf(substring) !== -1) {
      return substring;
    }
  }
  return null;
};

// a mapping of reasons why any transaction might fail and the human-readable version of that error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commonErrors: any = {
  // user messed up manual gas values
  "transaction underpriced":
    "Transaction under-priced. Please check the supplied gas amount and try again.",
  "intrinsic gas too low":
    "Transaction under-priced. Please check the supplied gas amount and try again.",

  // user denied signature via metamask
  "User denied transaction signature": "Denied transaction signature",
  "User denied message signature": "Denied transaction signature",

  // transfer specific - recieving address may have been a crucible address
  "transfer to non ERC721Receiver implementer":
    "Invalid transfer recipient address",

  // balance errors
  "insufficient balance": "Insufficient balance",
};

export const parseTransactionError = (error: any) => {
  const errorMsg =
    error?.error?.message || error?.message || "Transaction Failed";

  const commonError = containsAny(errorMsg, Object.keys(commonErrors));

  if (commonError) {
    return commonErrors[commonError];
  }

  return errorMsg.slice(0, 100);
};
