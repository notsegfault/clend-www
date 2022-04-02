const infuraId = "9aa3d95b3bc440fa88ea12eaa4456161";
const url = "https://coregov.eth.limo";

module.exports = {
  title: "CoreDAO Lending Protocol",
  appName: "CoreDAO Lending",
  description: "CoreDAO Lending Protocol",
  version: "1.0.1",
  url,
  ogImageUrl:
    "https://gateway.pinata.cloud/ipfs/QmdAHnK7Mu14ZyiU6At2fm9KtpaQoNs3AwK5G6u32dFj2t",
  twitterHandle: "@CORE_Vault",
  infuraId,

  supportedNetworks: [1],
  appName: url,

  // Each item is chainId: config
  networks: {
    1: {
      rpcUrl: `https://eth-mainnet.alchemyapi.io/v2/TsLEJAhX87icgMO7ZVyPcpeEgpFEo96O`,
    },
    1337: {
      rpcUrl: "http://localhost:8545",
    },
  },
};
