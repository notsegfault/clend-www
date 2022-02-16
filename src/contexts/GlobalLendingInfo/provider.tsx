import { useCoingeckoTokenPrice } from "@usedapp/coingecko";
import { useContractCalls, useEthers, useTokenBalance } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { FC, ReactNode, useEffect, useState } from "react";

import {
  TokenInfos,
  LendingContract,
  DaiContract,
  CoreToken,
  CoreDAOToken,
  CoreVaultContract,
} from "../../constants";
import { useCollateral } from "../../hooks/useCollateral";
import { LendingInterface, ERC20Interface } from "abi";

import { GlobalLendingInfoContext } from "./context";

const approximatedBlockPerDay = 6450;
const approximatedBlockPerMonth = Math.ceil(
  (approximatedBlockPerDay * 365) / 12
);

const calculateApy = (
  totalFoTLast30Days: number,
  totalTokenInVault: number,
  tokenPriceInUsd: number,
  corePriceInUsd: number
) => {
  const coreGeneratedPerYear = totalFoTLast30Days * (365 / 30);
  const valueGeneratedPerYear = coreGeneratedPerYear * corePriceInUsd;
  const valueOfPoolInToken = totalTokenInVault * tokenPriceInUsd;

  return (valueGeneratedPerYear * 100) / valueOfPoolInToken;
};

export const GlobalLendingInfoProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { collateralContext } = useCollateral();
  const { library: provider } = useEthers();
  const totalCoreDaoStaked =
    useTokenBalance(CoreDAOToken.address, CoreVaultContract.address) ||
    undefined;

  const corePriceInUsd = useCoingeckoTokenPrice(CoreToken.address, "usd");
  const tokenAddress = TokenInfos.get(collateralContext)?.address;
  const [coreDaoApy, setCoreDaoApy] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (provider) {
      (async () => {
        if (coreDaoApy || !totalCoreDaoStaked || !corePriceInUsd) return;

        const decoder = new ethers.utils.AbiCoder();
        const toBlock = await provider.getBlockNumber();
        const fromBlock = toBlock - approximatedBlockPerMonth;

        console.log(
          `Fetching Core Transfer Event from block ${fromBlock} to ${toBlock}...`
        );
        const vaultAddressHex =
          "0x000000000000000000000000c5cacb708425961594b63ec171f4df27a9c0d8c9";
        const totalFoTLast30Days = (
          await provider.getLogs({
            address: CoreToken.address, // Core Token
            topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            ], // Transfer event
            fromBlock,
            toBlock,
          })
        )
          .filter((log) => !log.removed && log.topics[2] === vaultAddressHex)
          .reduce((totalFoT: BigNumber, log) => {
            return totalFoT.add(decoder.decode(["uint256"], log.data)[0]);
          }, BigNumber.from(0));

        const totalFoTLast30DaysAsFloat = parseFloat(
          ethers.utils.formatEther(totalFoTLast30Days)
        );
        const totalCoreDaoStakedAsFloat = parseFloat(
          ethers.utils.formatEther(totalCoreDaoStaked)
        );

        console.log(
          `Done, total CoreDAO staked: ${totalCoreDaoStakedAsFloat}, total last 30days FoT: ${totalFoTLast30DaysAsFloat}`
        );

        const apy = calculateApy(
          totalFoTLast30DaysAsFloat,
          totalCoreDaoStakedAsFloat,
          1,
          parseFloat(corePriceInUsd)
        );

        setCoreDaoApy(apy);
      })();
    }
  }, [provider, corePriceInUsd, totalCoreDaoStaked]);

  const [
    yearlyPercentInterest,
    loanDefaultThresholdPercent,
    collaterabilityOfToken,
    availableDaiToBorrow,
  ] =
    useContractCalls([
      {
        abi: LendingInterface,
        address: LendingContract.address,
        method: "yearlyPercentInterest",
        args: [],
      },
      {
        abi: LendingInterface,
        address: LendingContract.address,
        method: "loanDefaultThresholdPercent",
        args: [],
      },
      {
        abi: LendingInterface,
        address: LendingContract.address,
        method: "collaterabilityOfToken",
        args: [tokenAddress || ""],
      },
      {
        abi: ERC20Interface,
        address: DaiContract.address,
        method: "balanceOf",
        args: [LendingContract.address],
      },
    ]) ?? [];

  return (
    <GlobalLendingInfoContext.Provider
      value={{
        yearlyPercentInterest: (yearlyPercentInterest || [])[0] as BigNumber,
        loanDefaultThresholdPercent: (loanDefaultThresholdPercent ||
          [])[0] as BigNumber,
        collaterabilityOfToken: (collaterabilityOfToken || [])[0] as BigNumber,
        availableDaiToBorrow: (availableDaiToBorrow || [])[0] as BigNumber,
        coreDaoApy,
      }}
    >
      {children}
    </GlobalLendingInfoContext.Provider>
  );
};
