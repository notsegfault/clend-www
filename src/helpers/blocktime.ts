import { getInfuraProvider } from "helpers/providers";

export const getBlockTimestamp = async (chainId: number): Promise<number> => {
  const provider = getInfuraProvider(chainId);
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  const blockTimestamp = block.timestamp;

  return blockTimestamp;
};
