export const sanitize = (input: string) => {
  if (!input || input === ".") {
    return "0";
  }
  return input;
};
