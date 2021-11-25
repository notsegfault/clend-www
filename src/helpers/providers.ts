import { InfuraProvider } from "@ethersproject/providers";

const infuraProviders: { [key: number]: InfuraProvider } = {
  1: new InfuraProvider(1, process.env.INFURA_API_KEY),
  3: new InfuraProvider(3, process.env.INFURA_API_KEY),
  4: new InfuraProvider(4, process.env.INFURA_API_KEY),
  5: new InfuraProvider(5, process.env.INFURA_API_KEY),
};

export const getInfuraProvider = (network: number) => {
  return infuraProviders[network];
};
