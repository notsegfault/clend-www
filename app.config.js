const infuraId = "9aa3d95b3bc440fa88ea12eaa4456161";
const url = "https://coregov-test.on.fleek.co/";

module.exports = {
  title: "Core Lending Protocol",
  appName: "Core Lending",
  description: "Core Lending Protocol",
  url,
  ogImageUrl:
    "https://gateway.pinata.cloud/ipfs/QmbfST2CWKy5bzGErioUs7r1PjNe7PXYkhsNxHxqrKSgX9",
  twitterHandle: "@CORE_Vault",
  infuraId,

  supportedNetworks: [1, 42],
  appName: url,

  // Each item is chainId: config
  networks: {
    1: {
      rpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    },
    1337: {
      rpcUrl: "http://localhost:8545",
    },
  },
};
