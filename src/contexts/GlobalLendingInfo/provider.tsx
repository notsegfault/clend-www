/* eslint-disable no-param-reassign */
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
import { Apy } from "../../types";
import { LendingInterface, ERC20Interface } from "abi";

import { GlobalLendingInfoContext } from "./context";

const approximatedBlockPerDay = 6450;
const approximatedBlockPerMonth = Math.ceil(
  (approximatedBlockPerDay * 365) / 12
);

interface FotStats {
  daily: BigNumber;
  weekly: BigNumber;
  monthly: BigNumber;
}

interface FotStatsAsFloat {
  daily: number;
  weekly: number;
  monthly: number;
}

const calculateApy = (
  fotStats: FotStatsAsFloat,
  totalTokenInVault: number,
  tokenPriceInUsd: number,
  corePriceInUsd: number
) => {
  const valueOfPoolInToken = totalTokenInVault * tokenPriceInUsd;

  return {
    daily: (fotStats.daily * 365 * corePriceInUsd * 100) / valueOfPoolInToken,
    weekly:
      (fotStats.weekly * (365 / 7) * corePriceInUsd * 100) / valueOfPoolInToken,
    monthly:
      (fotStats.monthly * (365 / 30) * corePriceInUsd * 100) /
      valueOfPoolInToken,
  };
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
  const [stakingApy, setStakingApy] = useState<Apy | undefined>(undefined);

  useEffect(() => {
    if (provider) {
      (async () => {
        if (stakingApy || !totalCoreDaoStaked || !corePriceInUsd) return;

        const decoder = new ethers.utils.AbiCoder();
        const toBlock = await provider.getBlockNumber();
        const fromBlock = toBlock - approximatedBlockPerMonth;

        const max7DaysBlockNumber = toBlock - approximatedBlockPerDay * 7;
        const max24HoursBlockNumber = toBlock - approximatedBlockPerDay;

        console.log(
          `Fetching Core Transfer Event from block ${fromBlock} to ${toBlock}...`
        );
        const vaultAddressHex =
          "0x000000000000000000000000c5cacb708425961594b63ec171f4df27a9c0d8c9";
        const logs = (
          await provider.getLogs({
            address: CoreToken.address, // Core Token
            topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            ], // Transfer event
            fromBlock,
            toBlock,
          })
        )
          .sort((evOne, evTwo) => evOne.blockNumber - evTwo.blockNumber)
          .filter((log) => !log.removed && log.topics[2] === vaultAddressHex);

        const defaultFotStats = {
          daily: BigNumber.from(0),
          weekly: BigNumber.from(0),
          monthly: BigNumber.from(0),
        } as FotStats;

        const fotStats: FotStats = logs.reduce((stats: FotStats, log) => {
          const fot = decoder.decode(["uint256"], log.data)[0];

          if (log.blockNumber <= max24HoursBlockNumber) {
            stats.daily = stats.daily.add(fot);
            stats.weekly = stats.weekly.add(fot);
          } else if (log.blockNumber <= max7DaysBlockNumber) {
            stats.weekly = stats.weekly.add(fot);
          }

          stats.monthly = stats.monthly.add(fot);
          return stats;
        }, defaultFotStats);

        const fotStatsAsFloat = {
          daily: parseFloat(ethers.utils.formatEther(fotStats.daily)),
          weekly: parseFloat(ethers.utils.formatEther(fotStats.weekly)),
          monthly: parseFloat(ethers.utils.formatEther(fotStats.monthly)),
        } as FotStatsAsFloat;

        const totalCoreDaoStakedAsFloat = parseFloat(
          ethers.utils.formatEther(totalCoreDaoStaked)
        );

        console.log(
          `Done, total CoreDAO staked: ${totalCoreDaoStakedAsFloat}, FoT Stats: ${fotStatsAsFloat}`
        );

        const apy = calculateApy(
          fotStatsAsFloat,
          totalCoreDaoStakedAsFloat,
          1,
          parseFloat(corePriceInUsd)
        );

        setStakingApy(apy);
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
        stakingApy,
      }}
    >
      {children}
    </GlobalLendingInfoContext.Provider>
  );
};
