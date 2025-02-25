import "dotenv/config";
import {
  createPublicClient,
  http,
  getContract,
  createWalletClient,
  PublicClient,
  WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";
import { EventEmitter } from "events";
import {
  STATEVIEW_ABI,
  V3_POOL_ABI,
  ARBITRAGE_CONTRACT_ABI,
  POSITION_MANAGER_ABI,
  V4_QUOTER_ABI,
  V3_QUOTER_ABI,
  VAULT_ABI,
} from "./abi.js";

// Define types for the environment variables
declare const process: {
  env: {
    ALCHEMY_API_KEY: string;
    PRIVATE_KEY: string;
  };
};

// Initialize the public client
const client: PublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
});

// Define contract addresses
const STATEVIEW_ADDRESS: `0x${string}` =
  "0x76fd297e2d437cd7f76d50f01afe6160f86e9990";
const V3_POOL_ADDR: `0x${string}` =
  "0xC6962004f452bE9203591991D15f6b388e09E8D0";
const ARBITRAGE_CONTRACT_ADDR: `0x${string}` =
  "0x1aD76Ea947A6C602F35D3e6AE284758ae226fa2d";
const POSITION_MANAGER_ADDR: `0x${string}` =
  "0xd88f38f930b7952f2db2432cb002e7abbf3dd869";
const V4_QUOTER: `0x${string}` = "0x3972c00f7ed4885e145823eb7c655375d275a1c5";
const V3_QUOTER: `0x${string}` = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

// Define token addresses
const WETH_ADDR: `0x${string}` = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
const USDC_ADDR: `0x${string}` = "0xaf88d065e77c8cc2239327c5edb3a432268e5831";

// Initialize contracts
const stateView = getContract({
  address: STATEVIEW_ADDRESS,
  abi: STATEVIEW_ABI,
  client,
});

const poolContract = getContract({
  address: V3_POOL_ADDR,
  abi: V3_POOL_ABI,
  client,
});

const positionManager = getContract({
  address: POSITION_MANAGER_ADDR,
  abi: POSITION_MANAGER_ABI,
  client,
});

// Initialize wallet client
const walletClient: WalletClient = createWalletClient({
  chain: arbitrum,
  transport: http(
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
});

// Define pool ID and owner address
const POOL_ID: `0x${string}` =
  "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf";
const POOL_ID_FULL: `0x${string}` =
  "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8";
const POOL_KEY = await positionManager.read.poolKeys([POOL_ID]);

// Function to get the ETH price on Uniswap
async function getPoolPrice(): Promise<number | undefined> {
  try {
    const [sqrtPriceX96] = (await stateView.read.getSlot0([
      POOL_ID_FULL,
    ])) as bigint[];
    const price: number = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
    return price;
  } catch (e) {
    console.error(e);
  }
}

// Function to get the ETH price on Pancakeswap
async function v3GetPrice(): Promise<number | undefined> {
  try {
    const [sqrtPriceX96] = (await poolContract.read.slot0()) as bigint[];
    const price: number = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
    return price;
  } catch (e) {
    console.log(e);
  }
}

// Function to quote exact input single on V4
async function quoteExactInputSingle(
  poolKey: any,
  zeroForOne: boolean,
  exactAmount: bigint,
  hookData: string,
): Promise<bigint> {
  const result: bigint[] = (await client.readContract({
    address: V4_QUOTER,
    abi: V4_QUOTER_ABI,
    functionName: "quoteExactInputSingle",
    args: [{ poolKey, zeroForOne, exactAmount, hookData }],
  })) as bigint[];
  return result[0];
}

// Function to quote exact input single on V3
async function quoteExactInputSingleV3(
  tokenIn: `0x${string}`,
  tokenOut: `0x${string}`,
  fee: number,
  amountIn: bigint,
  sqrtPriceLimitX96: number,
): Promise<bigint> {
  const result = (await client.readContract({
    address: V3_QUOTER,
    abi: V3_QUOTER_ABI,
    functionName: "quoteExactInputSingle",
    args: [tokenIn, tokenOut, fee, amountIn, sqrtPriceLimitX96],
  })) as bigint;
  return result;
}

// Function to simulate arbitrage
async function simulateArbitrage(
  amount: bigint,
  startOnUniswap: boolean,
): Promise<bigint> {
  let x: bigint;
  if (startOnUniswap) {
    x = await quoteExactInputSingleV3(
      USDC_ADDR,
      WETH_ADDR,
      500,
      await quoteExactInputSingle(POOL_KEY, true, amount, "0x"),
      0,
    );
  } else {
    x = await quoteExactInputSingle(
      POOL_KEY,
      false,
      await quoteExactInputSingleV3(WETH_ADDR, USDC_ADDR, 500, amount, 0),
      "0x",
    );
  }
  const pnl: number = Number(x) - Number(amount);
  console.log({ pnl });
  return x;
}

// Function to execute arbitrage
async function doArbitrage(
  amount: bigint,
  startOnUniswap: boolean,
): Promise<void> {
  try {
    await walletClient.writeContract({
      chain: arbitrum,
      address: ARBITRAGE_CONTRACT_ADDR,
      abi: ARBITRAGE_CONTRACT_ABI,
      functionName: "executeFlashLoan",
      account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
      args: [amount, WETH_ADDR, USDC_ADDR, startOnUniswap, POOL_KEY],
      gas: 2000000n,
    });
  } catch (e) {
    console.error(e);
  }
}

// Function to calculate percentage difference
function percentageDifference(price1: number, price2: number): number {
  return (Math.abs(price1 - price2) / Math.min(price1, price2)) * 100;
}

// Initialize event bus
const eventBus: EventEmitter = new EventEmitter();
const amount0: bigint = 7500000000000000000n;

// Store current prices
let currentUniswapPrice: number | null = null;
let currentUniswapV3Price: number | null = null;

// Start Uniswap price feed
async function startUniswapPriceFeed(): Promise<void> {
  setInterval(async () => {
    const uniswap_price: number | undefined = await getPoolPrice();
    if (uniswap_price !== undefined && uniswap_price !== currentUniswapPrice) {
      currentUniswapPrice = uniswap_price;
      eventBus.emit("uniswapPriceUpdate", uniswap_price);
    }
  }, 100);
}

// Start Uniswap V3 price feed
async function startUniswapV3PriceFeed(): Promise<void> {
  setInterval(async () => {
    const uniswapv3_price: number | undefined = await v3GetPrice();
    if (
      uniswapv3_price !== undefined &&
      uniswapv3_price !== currentUniswapV3Price
    ) {
      currentUniswapV3Price = uniswapv3_price;
      eventBus.emit("uniswapV3PriceUpdate", uniswapv3_price);
    }
  }, 100);
}

// Listen for Uniswap price updates
eventBus.on("uniswapPriceUpdate", (uniswap_price: number) => {
  console.log({ uniswap_price });
  checkArbitrage();
});

// Listen for Uniswap V3 price updates
eventBus.on("uniswapV3PriceUpdate", (uniswapv3_price: number) => {
  console.log({ uniswapv3_price });
  checkArbitrage();
});

// Check arbitrage opportunity when prices change
async function checkArbitrage(): Promise<void> {
  if (currentUniswapPrice === null || currentUniswapV3Price === null) {
    return;
  }

  const percent_diff: number =
    percentageDifference(currentUniswapPrice, currentUniswapV3Price) * 100;
  console.log({ percent_diff });

  if (percent_diff < 7.68) {
    return;
  }

  if (currentUniswapPrice > currentUniswapV3Price) {
    if (Number(await simulateArbitrage(amount0, true)) > Number(amount0)) {
      await doArbitrage(amount0, true);
    }
  } else {
    if (Number(await simulateArbitrage(amount0, false)) > Number(amount0)) {
      await doArbitrage(amount0, false);
    }
  }
}

// Start both price feeds
startUniswapPriceFeed();
startUniswapV3PriceFeed();
