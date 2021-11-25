export const wait = async (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};
