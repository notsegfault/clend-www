const infuraId = "9aa3d95b3bc440fa88ea12eaa4456161";
const url = "https://coregov.eth.link";

module.exports = {
  title: "CoreDAO Lending Protocol",
  appName: "CoreDAO Lending",
  description: "CoreDAO Lending Protocol",
  url,
  ogImageUrl:
    "https://gateway.pinata.cloud/ipfs/QmdAHnK7Mu14ZyiU6At2fm9KtpaQoNs3AwK5G6u32dFj2t",
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
