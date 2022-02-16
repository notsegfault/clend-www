import { ChainId } from "@usedapp/core";
import { Contract, utils } from "ethers";

import { CoreVaultInterface } from "../abi";
import { ERC20Interface } from "../abi/ERC20Interface";
import { LendingInterface } from "../abi/LendingInterface";
import { getTokenLogoURL } from "../utils";
import { TokenContract, TokenId, TokenInfo } from "types";

const Addresses = {
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  CORE: "0x62359ed7505efc61ff1d56fef82158ccaffa23d7",
  CoreDAO: "0xf66Cd2f8755a21d3c8683a10269F795c0532Dd58",
  Lending: "0x54B276C8a484eBF2a244D933AF5FFaf595ea58c5",
  CoreVault: "0xC5cacb708425961594B63eC171f4df27a9c0d8c9",
};

export const DaiContract = new Contract(
  utils.getAddress(Addresses.DAI),
  ERC20Interface
);

export const CoreContract = new Contract(
  utils.getAddress(Addresses.CORE),
  ERC20Interface
);

export const CoreDAOContract = new Contract(
  utils.getAddress(Addresses.CoreDAO),
  ERC20Interface
);

export const CoreVaultContract = new Contract(
  utils.getAddress(Addresses.CoreVault),
  CoreVaultInterface
);

export const LendingContract = new Contract(
  utils.getAddress(Addresses.Lending),
  LendingInterface
);

export const DaiToken = new TokenContract(
  "Dai",
  "DAI",
  ChainId.Mainnet,
  DaiContract.address,
  DaiContract
);

export const CoreToken = new TokenContract(
  "CORE",
  "CORE",
  ChainId.Mainnet,
  CoreContract.address,
  CoreContract
);

export const CoreDAOToken = new TokenContract(
  "CoreDAO",
  "COREDAO",
  ChainId.Mainnet,
  CoreDAOContract.address,
  CoreDAOContract
);

export const TokenInfos: Map<TokenId, TokenInfo> = new Map();

TokenInfos.set(TokenId.Core, {
  name: "CORE",
  collateral: true,
  value: TokenId.Core,
  iconUrl: getTokenLogoURL("0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7"),
  address: Addresses.CORE,
  isDisabled: false,
});

TokenInfos.set(TokenId.CoreDAO, {
  name: "CoreDAO",
  collateral: true,
  value: TokenId.CoreDAO,
  iconUrl: "/coreDAOlogo.png", // Replace with getTokenLogoURL(...) once it's added to trustwallet.
  address: Addresses.CoreDAO,
  isDisabled: false,
});

TokenInfos.set(TokenId.Dai, {
  name: "DAI",
  value: TokenId.Dai,
  collateral: false,
  iconUrl: getTokenLogoURL("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
  address: Addresses.DAI,
});
