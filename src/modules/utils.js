import { arbitrum } from "viem/chains";
import { poolContract } from "../abi/pool.js";
import { stateView } from "../abi/stateview.js";
import { walletClient } from "./client.js";
import { privateKeyToAccount } from "viem/accounts";
import { POOL_ID } from "./constants.js";

// Call this to get the ETH price on Uniswap
export async function getPoolPrice() {
  const [sqrtPriceX96, tick, protocolFee, lpFee] =
    await stateView.read.getSlot0([POOL_ID]);
  const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
  return price;
}


// Call this to get the ETH price on Pancakeswap
export async function pancakeGetPrice() {
  const [sqrtPriceX96] = await poolContract.read.slot0();
  const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
  return price;
}


export async function doArbitrage(amount, startOnUniswap) {
  try {
    return await walletClient.writeContract({
      chain: arbitrum,
      address: ARBITRAGE_CONTRACT_ADDR,
      abi: ARBITRAGE_CONTRACT_ABI,
      functionName: "executeFlashLoan",
      account: privateKeyToAccount(process.env.PRIVATE_KEY),
      args: [amount, USDC_ADDR, WETH_ADDR, startOnUniswap, poolKey],
      gas: 2000000,
    });
  } catch (e) {
    console.error(e);
  }
}

export function percentageDifference(price1, price2) {
  return (Math.abs(price1 - price2) / Math.min(price1, price2)) * 100;
}
