import "dotenv/config";
import {
  createPublicClient,
  http,
  getContract,
  createWalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";
import { EventEmitter } from "events";

const client = createPublicClient({
  chain: arbitrum,
  transport: http(
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
  // transport: http(
  //     `https://virtual.arbitrum.rpc.tenderly.co/ae445137-8eb0-478d-ba2a-7ac3b1f7d14b`,
  // ),
});

const STATEVIEW_ADDRESS = "0x76fd297e2d437cd7f76d50f01afe6160f86e9990";
const STATEVIEW_ABI = [
  {
    inputs: [
      {
        internalType: "contract IPoolManager",
        name: "_poolManager",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
    name: "getFeeGrowthGlobals",
    outputs: [
      { internalType: "uint256", name: "feeGrowthGlobal0", type: "uint256" },
      { internalType: "uint256", name: "feeGrowthGlobal1", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "PoolId", name: "poolId", type: "bytes32" },
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
    ],
    name: "getFeeGrowthInside",
    outputs: [
      {
        internalType: "uint256",
        name: "feeGrowthInside0X128",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeGrowthInside1X128",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
    name: "getLiquidity",
    outputs: [{ internalType: "uint128", name: "liquidity", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "PoolId", name: "poolId", type: "bytes32" },
      { internalType: "bytes32", name: "positionId", type: "bytes32" },
    ],
    name: "getPositionInfo",
    outputs: [
      { internalType: "uint128", name: "liquidity", type: "uint128" },
      {
        internalType: "uint256",
        name: "feeGrowthInside0LastX128",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeGrowthInside1LastX128",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "PoolId", name: "poolId", type: "bytes32" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
      { internalType: "bytes32", name: "salt", type: "bytes32" },
    ],
    name: "getPositionInfo",
    outputs: [
      { internalType: "uint128", name: "liquidity", type: "uint128" },
      {
        internalType: "uint256",
        name: "feeGrowthInside0LastX128",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeGrowthInside1LastX128",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "PoolId", name: "poolId", type: "bytes32" },
      { internalType: "bytes32", name: "positionId", type: "bytes32" },
    ],
    name: "getPositionLiquidity",
    outputs: [{ internalType: "uint128", name: "liquidity", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
    name: "getSlot0",
    outputs: [
      { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
      { internalType: "int24", name: "tick", type: "int24" },
      { internalType: "uint24", name: "protocolFee", type: "uint24" },
      { internalType: "uint24", name: "lpFee", type: "uint24" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "PoolId", name: "poolId", type: "bytes32" },
      { internalType: "int16", name: "tick", type: "int16" },
    ],
    name: "getTickBitmap",
    outputs: [{ internalType: "uint256", name: "tickBitmap", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "PoolId", name: "poolId", type: "bytes32" },
      { internalType: "int24", name: "tick", type: "int24" },
    ],
    name: "getTickFeeGrowthOutside",
    outputs: [
      {
        internalType: "uint256",
        name: "feeGrowthOutside0X128",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeGrowthOutside1X128",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "PoolId", name: "poolId", type: "bytes32" },
      { internalType: "int24", name: "tick", type: "int24" },
    ],
    name: "getTickInfo",
    outputs: [
      { internalType: "uint128", name: "liquidityGross", type: "uint128" },
      { internalType: "int128", name: "liquidityNet", type: "int128" },
      {
        internalType: "uint256",
        name: "feeGrowthOutside0X128",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeGrowthOutside1X128",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "PoolId", name: "poolId", type: "bytes32" },
      { internalType: "int24", name: "tick", type: "int24" },
    ],
    name: "getTickLiquidity",
    outputs: [
      { internalType: "uint128", name: "liquidityGross", type: "uint128" },
      { internalType: "int128", name: "liquidityNet", type: "int128" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolManager",
    outputs: [
      { internalType: "contract IPoolManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const stateView = getContract({
  address: STATEVIEW_ADDRESS,
  abi: STATEVIEW_ABI,
  client,
});

const WETH_ADDR = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
const USDC_ADDR = "0xaf88d065e77c8cc2239327c5edb3a432268e5831";

const POOL_ID =
  "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8";

// Call this to get the ETH price on Uniswap
async function getPoolPrice() {
  try {
    const [sqrtPriceX96, tick, protocolFee, lpFee] =
      await stateView.read.getSlot0([POOL_ID]);
    const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
    return price;
  } catch (e) {
    console.error(e);
  }
}

const PANCAKE_POOL_ADDR = "0xC6962004f452bE9203591991D15f6b388e09E8D0";
const PANCAKE_POOL_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickLower",
        type: "int24",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickUpper",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickLower",
        type: "int24",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickUpper",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount0",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount1",
        type: "uint128",
      },
    ],
    name: "Collect",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount0",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount1",
        type: "uint128",
      },
    ],
    name: "CollectProtocol",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paid0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paid1",
        type: "uint256",
      },
    ],
    name: "Flash",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "observationCardinalityNextOld",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "observationCardinalityNextNew",
        type: "uint16",
      },
    ],
    name: "IncreaseObservationCardinalityNext",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint160",
        name: "sqrtPriceX96",
        type: "uint160",
      },
      { indexed: false, internalType: "int24", name: "tick", type: "int24" },
    ],
    name: "Initialize",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickLower",
        type: "int24",
      },
      {
        indexed: true,
        internalType: "int24",
        name: "tickUpper",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amount",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "feeProtocol0Old",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "feeProtocol1Old",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "feeProtocol0New",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "feeProtocol1New",
        type: "uint8",
      },
    ],
    name: "SetFeeProtocol",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "amount0",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "amount1",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint160",
        name: "sqrtPriceX96",
        type: "uint160",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "liquidity",
        type: "uint128",
      },
      { indexed: false, internalType: "int24", name: "tick", type: "int24" },
    ],
    name: "Swap",
    type: "event",
  },
  {
    inputs: [
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
      { internalType: "uint128", name: "amount", type: "uint128" },
    ],
    name: "burn",
    outputs: [
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
      { internalType: "uint128", name: "amount0Requested", type: "uint128" },
      { internalType: "uint128", name: "amount1Requested", type: "uint128" },
    ],
    name: "collect",
    outputs: [
      { internalType: "uint128", name: "amount0", type: "uint128" },
      { internalType: "uint128", name: "amount1", type: "uint128" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint128", name: "amount0Requested", type: "uint128" },
      { internalType: "uint128", name: "amount1Requested", type: "uint128" },
    ],
    name: "collectProtocol",
    outputs: [
      { internalType: "uint128", name: "amount0", type: "uint128" },
      { internalType: "uint128", name: "amount1", type: "uint128" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeGrowthGlobal0X128",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeGrowthGlobal1X128",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "flash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "observationCardinalityNext",
        type: "uint16",
      },
    ],
    name: "increaseObservationCardinalityNext",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidity",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxLiquidityPerTick",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
      { internalType: "uint128", name: "amount", type: "uint128" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "mint",
    outputs: [
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "observations",
    outputs: [
      { internalType: "uint32", name: "blockTimestamp", type: "uint32" },
      { internalType: "int56", name: "tickCumulative", type: "int56" },
      {
        internalType: "uint160",
        name: "secondsPerLiquidityCumulativeX128",
        type: "uint160",
      },
      { internalType: "bool", name: "initialized", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint32[]", name: "secondsAgos", type: "uint32[]" },
    ],
    name: "observe",
    outputs: [
      { internalType: "int56[]", name: "tickCumulatives", type: "int56[]" },
      {
        internalType: "uint160[]",
        name: "secondsPerLiquidityCumulativeX128s",
        type: "uint160[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "positions",
    outputs: [
      { internalType: "uint128", name: "liquidity", type: "uint128" },
      {
        internalType: "uint256",
        name: "feeGrowthInside0LastX128",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeGrowthInside1LastX128",
        type: "uint256",
      },
      { internalType: "uint128", name: "tokensOwed0", type: "uint128" },
      { internalType: "uint128", name: "tokensOwed1", type: "uint128" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFees",
    outputs: [
      { internalType: "uint128", name: "token0", type: "uint128" },
      { internalType: "uint128", name: "token1", type: "uint128" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint8", name: "feeProtocol0", type: "uint8" },
      { internalType: "uint8", name: "feeProtocol1", type: "uint8" },
    ],
    name: "setFeeProtocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "slot0",
    outputs: [
      { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
      { internalType: "int24", name: "tick", type: "int24" },
      { internalType: "uint16", name: "observationIndex", type: "uint16" },
      {
        internalType: "uint16",
        name: "observationCardinality",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "observationCardinalityNext",
        type: "uint16",
      },
      { internalType: "uint8", name: "feeProtocol", type: "uint8" },
      { internalType: "bool", name: "unlocked", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
    ],
    name: "snapshotCumulativesInside",
    outputs: [
      { internalType: "int56", name: "tickCumulativeInside", type: "int56" },
      {
        internalType: "uint160",
        name: "secondsPerLiquidityInsideX128",
        type: "uint160",
      },
      { internalType: "uint32", name: "secondsInside", type: "uint32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "bool", name: "zeroForOne", type: "bool" },
      { internalType: "int256", name: "amountSpecified", type: "int256" },
      { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "swap",
    outputs: [
      { internalType: "int256", name: "amount0", type: "int256" },
      { internalType: "int256", name: "amount1", type: "int256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "int16", name: "", type: "int16" }],
    name: "tickBitmap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tickSpacing",
    outputs: [{ internalType: "int24", name: "", type: "int24" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "int24", name: "", type: "int24" }],
    name: "ticks",
    outputs: [
      { internalType: "uint128", name: "liquidityGross", type: "uint128" },
      { internalType: "int128", name: "liquidityNet", type: "int128" },
      {
        internalType: "uint256",
        name: "feeGrowthOutside0X128",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeGrowthOutside1X128",
        type: "uint256",
      },
      { internalType: "int56", name: "tickCumulativeOutside", type: "int56" },
      {
        internalType: "uint160",
        name: "secondsPerLiquidityOutsideX128",
        type: "uint160",
      },
      { internalType: "uint32", name: "secondsOutside", type: "uint32" },
      { internalType: "bool", name: "initialized", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
const poolContract = getContract({
  address: PANCAKE_POOL_ADDR,
  abi: PANCAKE_POOL_ABI,
  client,
});

// Call this to get the ETH price on Pancakeswap
async function pancakeGetPrice() {
  try {
    const [sqrtPriceX96] = await poolContract.read.slot0();
    const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
    return price;
  } catch (e) {
    console.log(e);
  }
}

const ARBITRAGE_CONTRACT_ADDR = "0x8B2AE4589cbE83C849E6c9f026106fD19630b967";
const ARBITRAGE_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "contract ISwapRouter",
        name: "_pRouter",
        type: "address",
      },
      {
        internalType: "contract UniversalRouter",
        name: "_uRouter",
        type: "address",
      },
      { internalType: "address", name: "_poolManager", type: "address" },
      { internalType: "address", name: "_permit2", type: "address" },
      { internalType: "address", name: "_balancerVault", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "Log",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Received",
    type: "event",
  },
  { stateMutability: "payable", type: "fallback" },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint160", name: "amount", type: "uint160" },
      { internalType: "uint48", name: "expiration", type: "uint48" },
      { internalType: "address", name: "_router", type: "address" },
    ],
    name: "approveTokenWithPermit2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "balancerVault",
    outputs: [
      { internalType: "contract IVaultMain", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "token0", type: "address" },
      { internalType: "address", name: "token1", type: "address" },
      { internalType: "bool", name: "startOnUniswap", type: "bool" },
      {
        components: [
          { internalType: "Currency", name: "currency0", type: "address" },
          { internalType: "Currency", name: "currency1", type: "address" },
          { internalType: "uint24", name: "fee", type: "uint24" },
          { internalType: "int24", name: "tickSpacing", type: "int24" },
          { internalType: "contract IHooks", name: "hooks", type: "address" },
        ],
        internalType: "struct PoolKey",
        name: "key",
        type: "tuple",
      },
    ],
    name: "executeFlashLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pRouter",
    outputs: [
      { internalType: "contract ISwapRouter", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "permit2",
    outputs: [{ internalType: "contract IPermit2", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolFee",
    outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolManager",
    outputs: [
      { internalType: "contract IPoolManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "userData", type: "bytes" }],
    name: "receiveFlashLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "refundToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address payable", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "refundUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "uRouter",
    outputs: [
      { internalType: "contract UniversalRouter", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

const arbitrageContract = getContract({
  address: ARBITRAGE_CONTRACT_ADDR,
  abi: ARBITRAGE_CONTRACT_ABI,
  client,
});

const walletClient = createWalletClient({
  chain: arbitrum,
  transport: http(
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
  // transport: http(
  //     `https://virtual.arbitrum.rpc.tenderly.co/ae445137-8eb0-478d-ba2a-7ac3b1f7d14b`,
  // ),
});

const POSITION_MANAGER_ADDR = "0xd88f38f930b7952f2db2432cb002e7abbf3dd869";
const POSITION_MANAGER_ABI = [
  {
    inputs: [
      {
        internalType: "contract IPoolManager",
        name: "_poolManager",
        type: "address",
      },
      {
        internalType: "contract IAllowanceTransfer",
        name: "_permit2",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_unsubscribeGasLimit",
        type: "uint256",
      },
      {
        internalType: "contract IPositionDescriptor",
        name: "_tokenDescriptor",
        type: "address",
      },
      { internalType: "contract IWETH9", name: "_weth9", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "subscriber", type: "address" },
    ],
    name: "AlreadySubscribed",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "subscriber", type: "address" },
      { internalType: "bytes", name: "reason", type: "bytes" },
    ],
    name: "BurnNotificationReverted",
    type: "error",
  },
  { inputs: [], name: "ContractLocked", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "deadline", type: "uint256" }],
    name: "DeadlinePassed",
    type: "error",
  },
  {
    inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
    name: "DeltaNotNegative",
    type: "error",
  },
  {
    inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
    name: "DeltaNotPositive",
    type: "error",
  },
  { inputs: [], name: "GasLimitTooLow", type: "error" },
  { inputs: [], name: "InputLengthMismatch", type: "error" },
  { inputs: [], name: "InsufficientBalance", type: "error" },
  { inputs: [], name: "InvalidContractSignature", type: "error" },
  { inputs: [], name: "InvalidEthSender", type: "error" },
  { inputs: [], name: "InvalidSignature", type: "error" },
  { inputs: [], name: "InvalidSignatureLength", type: "error" },
  { inputs: [], name: "InvalidSigner", type: "error" },
  {
    inputs: [
      { internalType: "uint128", name: "maximumAmount", type: "uint128" },
      { internalType: "uint128", name: "amountRequested", type: "uint128" },
    ],
    name: "MaximumAmountExceeded",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint128", name: "minimumAmount", type: "uint128" },
      { internalType: "uint128", name: "amountReceived", type: "uint128" },
    ],
    name: "MinimumAmountInsufficient",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "subscriber", type: "address" },
      { internalType: "bytes", name: "reason", type: "bytes" },
    ],
    name: "ModifyLiquidityNotificationReverted",
    type: "error",
  },
  { inputs: [], name: "NoCodeSubscriber", type: "error" },
  { inputs: [], name: "NoSelfPermit", type: "error" },
  { inputs: [], name: "NonceAlreadyUsed", type: "error" },
  {
    inputs: [{ internalType: "address", name: "caller", type: "address" }],
    name: "NotApproved",
    type: "error",
  },
  { inputs: [], name: "NotPoolManager", type: "error" },
  { inputs: [], name: "NotSubscribed", type: "error" },
  { inputs: [], name: "PoolManagerMustBeLocked", type: "error" },
  { inputs: [], name: "SignatureDeadlineExpired", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "subscriber", type: "address" },
      { internalType: "bytes", name: "reason", type: "bytes" },
    ],
    name: "SubscriptionReverted",
    type: "error",
  },
  { inputs: [], name: "Unauthorized", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "action", type: "uint256" }],
    name: "UnsupportedAction",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
    ],
    name: "Subscription",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
    ],
    name: "Unsubscription",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETH9",
    outputs: [{ internalType: "contract IWETH9", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getPoolAndPositionInfo",
    outputs: [
      {
        components: [
          { internalType: "Currency", name: "currency0", type: "address" },
          { internalType: "Currency", name: "currency1", type: "address" },
          { internalType: "uint24", name: "fee", type: "uint24" },
          { internalType: "int24", name: "tickSpacing", type: "int24" },
          { internalType: "contract IHooks", name: "hooks", type: "address" },
        ],
        internalType: "struct PoolKey",
        name: "poolKey",
        type: "tuple",
      },
      { internalType: "PositionInfo", name: "info", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getPositionLiquidity",
    outputs: [{ internalType: "uint128", name: "liquidity", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "Currency", name: "currency0", type: "address" },
          { internalType: "Currency", name: "currency1", type: "address" },
          { internalType: "uint24", name: "fee", type: "uint24" },
          { internalType: "int24", name: "tickSpacing", type: "int24" },
          { internalType: "contract IHooks", name: "hooks", type: "address" },
        ],
        internalType: "struct PoolKey",
        name: "key",
        type: "tuple",
      },
      { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
    ],
    name: "initializePool",
    outputs: [{ internalType: "int24", name: "", type: "int24" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "unlockData", type: "bytes" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "modifyLiquidities",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "actions", type: "bytes" },
      { internalType: "bytes[]", name: "params", type: "bytes[]" },
    ],
    name: "modifyLiquiditiesWithoutUnlock",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "msgSender",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }],
    name: "multicall",
    outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextTokenId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "word", type: "uint256" },
    ],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "bitmap", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "owner", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint160", name: "amount", type: "uint160" },
              { internalType: "uint48", name: "expiration", type: "uint48" },
              { internalType: "uint48", name: "nonce", type: "uint48" },
            ],
            internalType: "struct IAllowanceTransfer.PermitDetails",
            name: "details",
            type: "tuple",
          },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "sigDeadline", type: "uint256" },
        ],
        internalType: "struct IAllowanceTransfer.PermitSingle",
        name: "permitSingle",
        type: "tuple",
      },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "permit",
    outputs: [{ internalType: "bytes", name: "err", type: "bytes" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "permit2",
    outputs: [
      {
        internalType: "contract IAllowanceTransfer",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      {
        components: [
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint160", name: "amount", type: "uint160" },
              { internalType: "uint48", name: "expiration", type: "uint48" },
              { internalType: "uint48", name: "nonce", type: "uint48" },
            ],
            internalType: "struct IAllowanceTransfer.PermitDetails[]",
            name: "details",
            type: "tuple[]",
          },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "sigDeadline", type: "uint256" },
        ],
        internalType: "struct IAllowanceTransfer.PermitBatch",
        name: "_permitBatch",
        type: "tuple",
      },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "permitBatch",
    outputs: [{ internalType: "bytes", name: "err", type: "bytes" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "permitForAll",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes25", name: "poolId", type: "bytes25" }],
    name: "poolKeys",
    outputs: [
      { internalType: "Currency", name: "currency0", type: "address" },
      { internalType: "Currency", name: "currency1", type: "address" },
      { internalType: "uint24", name: "fee", type: "uint24" },
      { internalType: "int24", name: "tickSpacing", type: "int24" },
      { internalType: "contract IHooks", name: "hooks", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolManager",
    outputs: [
      { internalType: "contract IPoolManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "positionInfo",
    outputs: [{ internalType: "PositionInfo", name: "info", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "nonce", type: "uint256" }],
    name: "revokeNonce",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "newSubscriber", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "subscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "subscriber",
    outputs: [
      {
        internalType: "contract ISubscriber",
        name: "subscriber",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenDescriptor",
    outputs: [
      {
        internalType: "contract IPositionDescriptor",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
    name: "unlockCallback",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "unsubscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "unsubscribeGasLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

const positionManager = getContract({
  address: POSITION_MANAGER_ADDR,
  abi: POSITION_MANAGER_ABI,
  client,
});

const poolId = "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf";
const poolKey = await positionManager.read.poolKeys([poolId]);

const owner = "0x655815CFaC22597C4339B76A8B7f8f3da6e648cD";
const uRouter = "0x6ff5693b99212da76ad316178a184ab56d299b43";
const pRouter = "0x1b81D678ffb9C0263b24A97847620C99d213eB14";

const v4_quoter = "0x3972c00f7ed4885e145823eb7c655375d275a1c5";
const v4_quoter_abi = [
  {
    inputs: [
      {
        internalType: "contract IPoolManager",
        name: "_poolManager",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
    name: "NotEnoughLiquidity",
    type: "error",
  },
  { inputs: [], name: "NotPoolManager", type: "error" },
  { inputs: [], name: "NotSelf", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "QuoteSwap",
    type: "error",
  },
  { inputs: [], name: "UnexpectedCallSuccess", type: "error" },
  {
    inputs: [{ internalType: "bytes", name: "revertData", type: "bytes" }],
    name: "UnexpectedRevertBytes",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "Currency", name: "exactCurrency", type: "address" },
          {
            components: [
              {
                internalType: "Currency",
                name: "intermediateCurrency",
                type: "address",
              },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              {
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
              },
              { internalType: "bytes", name: "hookData", type: "bytes" },
            ],
            internalType: "struct PathKey[]",
            name: "path",
            type: "tuple[]",
          },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
        ],
        internalType: "struct IV4Quoter.QuoteExactParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "_quoteExactInput",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "Currency", name: "currency0", type: "address" },
              { internalType: "Currency", name: "currency1", type: "address" },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              {
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
              },
            ],
            internalType: "struct PoolKey",
            name: "poolKey",
            type: "tuple",
          },
          { internalType: "bool", name: "zeroForOne", type: "bool" },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
          { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        internalType: "struct IV4Quoter.QuoteExactSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "_quoteExactInputSingle",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "Currency", name: "exactCurrency", type: "address" },
          {
            components: [
              {
                internalType: "Currency",
                name: "intermediateCurrency",
                type: "address",
              },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              {
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
              },
              { internalType: "bytes", name: "hookData", type: "bytes" },
            ],
            internalType: "struct PathKey[]",
            name: "path",
            type: "tuple[]",
          },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
        ],
        internalType: "struct IV4Quoter.QuoteExactParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "_quoteExactOutput",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "Currency", name: "currency0", type: "address" },
              { internalType: "Currency", name: "currency1", type: "address" },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              {
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
              },
            ],
            internalType: "struct PoolKey",
            name: "poolKey",
            type: "tuple",
          },
          { internalType: "bool", name: "zeroForOne", type: "bool" },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
          { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        internalType: "struct IV4Quoter.QuoteExactSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "_quoteExactOutputSingle",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "poolManager",
    outputs: [
      { internalType: "contract IPoolManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "Currency", name: "exactCurrency", type: "address" },
          {
            components: [
              {
                internalType: "Currency",
                name: "intermediateCurrency",
                type: "address",
              },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              {
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
              },
              { internalType: "bytes", name: "hookData", type: "bytes" },
            ],
            internalType: "struct PathKey[]",
            name: "path",
            type: "tuple[]",
          },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
        ],
        internalType: "struct IV4Quoter.QuoteExactParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "quoteExactInput",
    outputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "gasEstimate", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "Currency", name: "currency0", type: "address" },
              { internalType: "Currency", name: "currency1", type: "address" },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              {
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
              },
            ],
            internalType: "struct PoolKey",
            name: "poolKey",
            type: "tuple",
          },
          { internalType: "bool", name: "zeroForOne", type: "bool" },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
          { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        internalType: "struct IV4Quoter.QuoteExactSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "quoteExactInputSingle",
    outputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "gasEstimate", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "Currency", name: "exactCurrency", type: "address" },
          {
            components: [
              {
                internalType: "Currency",
                name: "intermediateCurrency",
                type: "address",
              },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              {
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
              },
              { internalType: "bytes", name: "hookData", type: "bytes" },
            ],
            internalType: "struct PathKey[]",
            name: "path",
            type: "tuple[]",
          },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
        ],
        internalType: "struct IV4Quoter.QuoteExactParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "quoteExactOutput",
    outputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "gasEstimate", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "Currency", name: "currency0", type: "address" },
              { internalType: "Currency", name: "currency1", type: "address" },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              {
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
              },
            ],
            internalType: "struct PoolKey",
            name: "poolKey",
            type: "tuple",
          },
          { internalType: "bool", name: "zeroForOne", type: "bool" },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
          { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        internalType: "struct IV4Quoter.QuoteExactSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "quoteExactOutputSingle",
    outputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "gasEstimate", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
    name: "unlockCallback",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function quoteExactInputSingle(
  poolKey,
  zeroForOne,
  exactAmount,
  hookData,
) {
  const result = await client.readContract({
    address: v4_quoter,
    abi: v4_quoter_abi,
    functionName: "quoteExactInputSingle",
    args: [{ poolKey, zeroForOne, exactAmount, hookData }],
  });
  return result[0];
}

const v3_quoter = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
const v3_quoter_abi = [
  {
    inputs: [
      { internalType: "address", name: "_factory", type: "address" },
      { internalType: "address", name: "_WETH9", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "WETH9",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "path", type: "bytes" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
    ],
    name: "quoteExactInput",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint24", name: "fee", type: "uint24" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
    ],
    name: "quoteExactInputSingle",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "path", type: "bytes" },
      { internalType: "uint256", name: "amountOut", type: "uint256" },
    ],
    name: "quoteExactOutput",
    outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint24", name: "fee", type: "uint24" },
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
    ],
    name: "quoteExactOutputSingle",
    outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "int256", name: "amount0Delta", type: "int256" },
      { internalType: "int256", name: "amount1Delta", type: "int256" },
      { internalType: "bytes", name: "path", type: "bytes" },
    ],
    name: "uniswapV3SwapCallback",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];

const vault = "0xbA1333333333a1BA1108E8412f11850A5C319bA9";
const vault_abi = [
  {
    inputs: [
      {
        internalType: "contract IVaultExtension",
        name: "vaultExtension",
        type: "address",
      },
      {
        internalType: "contract IAuthorizer",
        name: "authorizer",
        type: "address",
      },
      {
        internalType: "contract IProtocolFeeController",
        name: "protocolFeeController",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  { inputs: [], name: "AfterAddLiquidityHookFailed", type: "error" },
  { inputs: [], name: "AfterInitializeHookFailed", type: "error" },
  { inputs: [], name: "AfterRemoveLiquidityHookFailed", type: "error" },
  { inputs: [], name: "AfterSwapHookFailed", type: "error" },
  { inputs: [], name: "AllZeroInputs", type: "error" },
  { inputs: [], name: "AmountGivenZero", type: "error" },
  {
    inputs: [
      { internalType: "contract IERC20", name: "tokenIn", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "maxAmountIn", type: "uint256" },
    ],
    name: "AmountInAboveMax",
    type: "error",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "tokenOut", type: "address" },
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
    ],
    name: "AmountOutBelowMin",
    type: "error",
  },
  { inputs: [], name: "BalanceNotSettled", type: "error" },
  { inputs: [], name: "BalanceOverflow", type: "error" },
  { inputs: [], name: "BeforeAddLiquidityHookFailed", type: "error" },
  { inputs: [], name: "BeforeInitializeHookFailed", type: "error" },
  { inputs: [], name: "BeforeRemoveLiquidityHookFailed", type: "error" },
  { inputs: [], name: "BeforeSwapHookFailed", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "maxAmountIn", type: "uint256" },
    ],
    name: "BptAmountInAboveMax",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
    ],
    name: "BptAmountOutBelowMin",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "BufferAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "BufferNotInitialized",
    type: "error",
  },
  { inputs: [], name: "BufferSharesInvalidOwner", type: "error" },
  { inputs: [], name: "BufferSharesInvalidReceiver", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "totalSupply", type: "uint256" }],
    name: "BufferTotalSupplyTooLow",
    type: "error",
  },
  { inputs: [], name: "CannotReceiveEth", type: "error" },
  { inputs: [], name: "CannotSwapSameToken", type: "error" },
  { inputs: [], name: "DoesNotSupportAddLiquidityCustom", type: "error" },
  { inputs: [], name: "DoesNotSupportDonation", type: "error" },
  { inputs: [], name: "DoesNotSupportRemoveLiquidityCustom", type: "error" },
  { inputs: [], name: "DoesNotSupportUnbalancedLiquidity", type: "error" },
  { inputs: [], name: "DynamicSwapFeeHookFailed", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "allowance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "spender", type: "address" }],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "FeePrecisionTooHigh", type: "error" },
  {
    inputs: [
      { internalType: "contract IERC20", name: "tokenIn", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "maxAmountIn", type: "uint256" },
    ],
    name: "HookAdjustedAmountInAboveMax",
    type: "error",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "tokenOut", type: "address" },
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
    ],
    name: "HookAdjustedAmountOutBelowMin",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "HookAdjustedSwapLimit",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "poolHooksContract", type: "address" },
      { internalType: "address", name: "pool", type: "address" },
      { internalType: "address", name: "poolFactory", type: "address" },
    ],
    name: "HookRegistrationFailed",
    type: "error",
  },
  { inputs: [], name: "InputLengthMismatch", type: "error" },
  { inputs: [], name: "InvalidAddLiquidityKind", type: "error" },
  { inputs: [], name: "InvalidRemoveLiquidityKind", type: "error" },
  { inputs: [], name: "InvalidToken", type: "error" },
  { inputs: [], name: "InvalidTokenConfiguration", type: "error" },
  { inputs: [], name: "InvalidTokenDecimals", type: "error" },
  { inputs: [], name: "InvalidTokenType", type: "error" },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "InvalidUnderlyingToken",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "invariantRatio", type: "uint256" },
      { internalType: "uint256", name: "maxInvariantRatio", type: "uint256" },
    ],
    name: "InvariantRatioAboveMax",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "invariantRatio", type: "uint256" },
      { internalType: "uint256", name: "minInvariantRatio", type: "uint256" },
    ],
    name: "InvariantRatioBelowMin",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "issuedShares", type: "uint256" },
      { internalType: "uint256", name: "minIssuedShares", type: "uint256" },
    ],
    name: "IssuedSharesBelowMin",
    type: "error",
  },
  { inputs: [], name: "MaxTokens", type: "error" },
  { inputs: [], name: "MinTokens", type: "error" },
  { inputs: [], name: "MultipleNonZeroInputs", type: "error" },
  { inputs: [], name: "NotEnoughBufferShares", type: "error" },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expectedUnderlyingAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actualUnderlyingAmount",
        type: "uint256",
      },
    ],
    name: "NotEnoughUnderlying",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expectedWrappedAmount",
        type: "uint256",
      },
      { internalType: "uint256", name: "actualWrappedAmount", type: "uint256" },
    ],
    name: "NotEnoughWrapped",
    type: "error",
  },
  { inputs: [], name: "NotStaticCall", type: "error" },
  { inputs: [], name: "NotVaultDelegateCall", type: "error" },
  { inputs: [], name: "PauseBufferPeriodDurationTooLarge", type: "error" },
  { inputs: [], name: "PercentageAboveMax", type: "error" },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolInRecoveryMode",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolNotInRecoveryMode",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolNotInitialized",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolNotPaused",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolNotRegistered",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolPauseWindowExpired",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "pool", type: "address" }],
    name: "PoolPaused",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "totalSupply", type: "uint256" }],
    name: "PoolTotalSupplyTooLow",
    type: "error",
  },
  { inputs: [], name: "ProtocolFeesExceedTotalCollected", type: "error" },
  { inputs: [], name: "QueriesDisabled", type: "error" },
  { inputs: [], name: "QueriesDisabledPermanently", type: "error" },
  { inputs: [], name: "QuoteResultSpoofed", type: "error" },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  { inputs: [], name: "RouterNotTrusted", type: "error" },
  {
    inputs: [{ internalType: "int256", name: "value", type: "int256" }],
    name: "SafeCastOverflowedIntToUint",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
    name: "SafeCastOverflowedUintToInt",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "SenderIsNotVault",
    type: "error",
  },
  { inputs: [], name: "SwapFeePercentageTooHigh", type: "error" },
  { inputs: [], name: "SwapFeePercentageTooLow", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "SwapLimit",
    type: "error",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "token", type: "address" },
    ],
    name: "TokenAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "token", type: "address" },
    ],
    name: "TokenNotRegistered",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "pool", type: "address" },
      { internalType: "address", name: "expectedToken", type: "address" },
      { internalType: "address", name: "actualToken", type: "address" },
    ],
    name: "TokensMismatch",
    type: "error",
  },
  { inputs: [], name: "TradeAmountTooSmall", type: "error" },
  { inputs: [], name: "VaultBuffersArePaused", type: "error" },
  { inputs: [], name: "VaultIsNotUnlocked", type: "error" },
  { inputs: [], name: "VaultNotPaused", type: "error" },
  { inputs: [], name: "VaultPauseWindowDurationTooLarge", type: "error" },
  { inputs: [], name: "VaultPauseWindowExpired", type: "error" },
  { inputs: [], name: "VaultPaused", type: "error" },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "WrapAmountTooSmall",
    type: "error",
  },
  { inputs: [], name: "WrongProtocolFeeControllerDeployment", type: "error" },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      { internalType: "address", name: "underlyingToken", type: "address" },
    ],
    name: "WrongUnderlyingToken",
    type: "error",
  },
  { inputs: [], name: "WrongVaultAdminDeployment", type: "error" },
  { inputs: [], name: "WrongVaultExtensionDeployment", type: "error" },
  { inputs: [], name: "ZeroDivision", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "aggregateSwapFeePercentage",
        type: "uint256",
      },
    ],
    name: "AggregateSwapFeePercentageChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "aggregateYieldFeePercentage",
        type: "uint256",
      },
    ],
    name: "AggregateYieldFeePercentageChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IAuthorizer",
        name: "newAuthorizer",
        type: "address",
      },
    ],
    name: "AuthorizerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "burnedShares",
        type: "uint256",
      },
    ],
    name: "BufferSharesBurned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "issuedShares",
        type: "uint256",
      },
    ],
    name: "BufferSharesMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "liquidityProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum AddLiquidityKind",
        name: "kind",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountsAddedRaw",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "swapFeeAmountsRaw",
        type: "uint256[]",
      },
    ],
    name: "LiquidityAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountUnderlying",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountWrapped",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "bufferBalances",
        type: "bytes32",
      },
    ],
    name: "LiquidityAddedToBuffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "liquidityProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum RemoveLiquidityKind",
        name: "kind",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountsRemovedRaw",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "swapFeeAmountsRaw",
        type: "uint256[]",
      },
    ],
    name: "LiquidityRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountUnderlying",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountWrapped",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "bufferBalances",
        type: "bytes32",
      },
    ],
    name: "LiquidityRemovedFromBuffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
    ],
    name: "PoolInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      { indexed: false, internalType: "bool", name: "paused", type: "bool" },
    ],
    name: "PoolPausedStateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: false,
        internalType: "bool",
        name: "recoveryMode",
        type: "bool",
      },
    ],
    name: "PoolRecoveryModeStateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "factory",
        type: "address",
      },
      {
        components: [
          { internalType: "contract IERC20", name: "token", type: "address" },
          { internalType: "enum TokenType", name: "tokenType", type: "uint8" },
          {
            internalType: "contract IRateProvider",
            name: "rateProvider",
            type: "address",
          },
          { internalType: "bool", name: "paysYieldFees", type: "bool" },
        ],
        indexed: false,
        internalType: "struct TokenConfig[]",
        name: "tokenConfig",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeePercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "pauseWindowEndTime",
        type: "uint32",
      },
      {
        components: [
          { internalType: "address", name: "pauseManager", type: "address" },
          { internalType: "address", name: "swapFeeManager", type: "address" },
          { internalType: "address", name: "poolCreator", type: "address" },
        ],
        indexed: false,
        internalType: "struct PoolRoleAccounts",
        name: "roleAccounts",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "enableHookAdjustedAmounts",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallBeforeInitialize",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallAfterInitialize",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallComputeDynamicSwapFee",
            type: "bool",
          },
          { internalType: "bool", name: "shouldCallBeforeSwap", type: "bool" },
          { internalType: "bool", name: "shouldCallAfterSwap", type: "bool" },
          {
            internalType: "bool",
            name: "shouldCallBeforeAddLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallAfterAddLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallBeforeRemoveLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallAfterRemoveLiquidity",
            type: "bool",
          },
          { internalType: "address", name: "hooksContract", type: "address" },
        ],
        indexed: false,
        internalType: "struct HooksConfig",
        name: "hooksConfig",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "disableUnbalancedLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "enableAddLiquidityCustom",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "enableRemoveLiquidityCustom",
            type: "bool",
          },
          { internalType: "bool", name: "enableDonation", type: "bool" },
        ],
        indexed: false,
        internalType: "struct LiquidityManagement",
        name: "liquidityManagement",
        type: "tuple",
      },
    ],
    name: "PoolRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IProtocolFeeController",
        name: "newProtocolFeeController",
        type: "address",
      },
    ],
    name: "ProtocolFeeControllerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: true,
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeePercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeeAmount",
        type: "uint256",
      },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeePercentage",
        type: "uint256",
      },
    ],
    name: "SwapFeePercentageChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "burnedShares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawnUnderlying",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "bufferBalances",
        type: "bytes32",
      },
    ],
    name: "Unwrap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "pool", type: "address" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "eventKey",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "eventData",
        type: "bytes",
      },
    ],
    name: "VaultAuxiliary",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bool", name: "paused", type: "bool" },
    ],
    name: "VaultBuffersPausedStateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bool", name: "paused", type: "bool" },
    ],
    name: "VaultPausedStateChanged",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "VaultQueriesDisabled", type: "event" },
  { anonymous: false, inputs: [], name: "VaultQueriesEnabled", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "depositedUnderlying",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintedShares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "bufferBalances",
        type: "bytes32",
      },
    ],
    name: "Wrap",
    type: "event",
  },
  { stateMutability: "payable", type: "fallback" },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "pool", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          {
            internalType: "uint256[]",
            name: "maxAmountsIn",
            type: "uint256[]",
          },
          { internalType: "uint256", name: "minBptAmountOut", type: "uint256" },
          {
            internalType: "enum AddLiquidityKind",
            name: "kind",
            type: "uint8",
          },
          { internalType: "bytes", name: "userData", type: "bytes" },
        ],
        internalType: "struct AddLiquidityParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "addLiquidity",
    outputs: [
      { internalType: "uint256[]", name: "amountsIn", type: "uint256[]" },
      { internalType: "uint256", name: "bptAmountOut", type: "uint256" },
      { internalType: "bytes", name: "returnData", type: "bytes" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "enum SwapKind", name: "kind", type: "uint8" },
          {
            internalType: "enum WrappingDirection",
            name: "direction",
            type: "uint8",
          },
          {
            internalType: "contract IERC4626",
            name: "wrappedToken",
            type: "address",
          },
          { internalType: "uint256", name: "amountGivenRaw", type: "uint256" },
          { internalType: "uint256", name: "limitRaw", type: "uint256" },
        ],
        internalType: "struct BufferWrapOrUnwrapParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "erc4626BufferWrapOrUnwrap",
    outputs: [
      { internalType: "uint256", name: "amountCalculatedRaw", type: "uint256" },
      { internalType: "uint256", name: "amountInRaw", type: "uint256" },
      { internalType: "uint256", name: "amountOutRaw", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "pool", type: "address" },
      { internalType: "contract IERC20", name: "token", type: "address" },
    ],
    name: "getPoolTokenCountAndIndexOfToken",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultExtension",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reentrancyGuardEntered",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "pool", type: "address" },
          { internalType: "address", name: "from", type: "address" },
          { internalType: "uint256", name: "maxBptAmountIn", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "minAmountsOut",
            type: "uint256[]",
          },
          {
            internalType: "enum RemoveLiquidityKind",
            name: "kind",
            type: "uint8",
          },
          { internalType: "bytes", name: "userData", type: "bytes" },
        ],
        internalType: "struct RemoveLiquidityParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "removeLiquidity",
    outputs: [
      { internalType: "uint256", name: "bptAmountIn", type: "uint256" },
      { internalType: "uint256[]", name: "amountsOut", type: "uint256[]" },
      { internalType: "bytes", name: "returnData", type: "bytes" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "token", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "sendTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "token", type: "address" },
      { internalType: "uint256", name: "amountHint", type: "uint256" },
    ],
    name: "settle",
    outputs: [{ internalType: "uint256", name: "credit", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "enum SwapKind", name: "kind", type: "uint8" },
          { internalType: "address", name: "pool", type: "address" },
          { internalType: "contract IERC20", name: "tokenIn", type: "address" },
          {
            internalType: "contract IERC20",
            name: "tokenOut",
            type: "address",
          },
          { internalType: "uint256", name: "amountGivenRaw", type: "uint256" },
          { internalType: "uint256", name: "limitRaw", type: "uint256" },
          { internalType: "bytes", name: "userData", type: "bytes" },
        ],
        internalType: "struct VaultSwapParams",
        name: "vaultSwapParams",
        type: "tuple",
      },
    ],
    name: "swap",
    outputs: [
      { internalType: "uint256", name: "amountCalculated", type: "uint256" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOut", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
    name: "unlock",
    outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

async function quoteExactInputSingleV3(
  tokenIn,
  tokenOut,
  fee,
  amountIn,
  sqrtPriceLimitX96,
) {
  const result = await client.readContract({
    address: v3_quoter,
    abi: v3_quoter_abi,
    functionName: "quoteExactInputSingle",
    args: [tokenIn, tokenOut, fee, amountIn, sqrtPriceLimitX96],
  });
  return result;
}

async function simulateArbitrage(amount, startOnUniswap) {
  let x;
  if (startOnUniswap) {
    x = await quoteExactInputSingleV3(
      USDC_ADDR,
      WETH_ADDR,
      500,
      await quoteExactInputSingle(poolKey, true, amount, "0x"),
      0,
    );
  } else {
    x = await quoteExactInputSingle(
      poolKey,
      false,
      await quoteExactInputSingleV3(WETH_ADDR, USDC_ADDR, 500, amount, 0),
      "0x",
    );
  }
  const pnl = Number(x) - amount;
  console.log({ pnl });
  return x;
}

async function doArbitrage(amount, startOnUniswap) {
  try {
    return await walletClient.writeContract({
      chain: arbitrum,
      address: ARBITRAGE_CONTRACT_ADDR,
      abi: ARBITRAGE_CONTRACT_ABI,
      functionName: "executeFlashLoan",
      account: privateKeyToAccount(process.env.PRIVATE_KEY),
      args: [amount, WETH_ADDR, USDC_ADDR, startOnUniswap, poolKey],
      gas: 2000000,
    });
  } catch (e) {
    console.error(e);
  }
}

function percentageDifference(price1, price2) {
  return (Math.abs(price1 - price2) / Math.min(price1, price2)) * 100;
}

const eventBus = new EventEmitter();
const amount0 = 7500000000000000000;

// Store current prices
let currentUniswapPrice;
let currentUniswapV3Price;

// Start Uniswap price feed
async function startUniswapPriceFeed() {
  setInterval(async () => {
    const uniswap_price = await getPoolPrice();

    if (uniswap_price !== currentUniswapPrice) {
      currentUniswapPrice = uniswap_price;
      eventBus.emit("uniswapPriceUpdate", uniswap_price);
    }
  }, 100);
}

// Start Uniswap V3 price feed
async function startUniswapV3PriceFeed() {
  setInterval(async () => {
    const uniswapv3_price = await pancakeGetPrice();

    if (uniswapv3_price !== currentUniswapV3Price) {
      currentUniswapV3Price = uniswapv3_price;
      eventBus.emit("uniswapV3PriceUpdate", uniswapv3_price);
    }
  }, 100);
}

// Listen for Uniswap price updates
eventBus.on("uniswapPriceUpdate", (uniswap_price) => {
  console.log({ uniswap_price });
  checkArbitrage();
});

// Listen for Uniswap V3 price updates
eventBus.on("uniswapV3PriceUpdate", (uniswapv3_price) => {
  console.log({ uniswapv3_price });
  checkArbitrage();
});

// Check arbitrage opportunity when prices change
async function checkArbitrage() {
  if (currentUniswapPrice === null || currentUniswapV3Price === null) {
    return;
  }

  const percent_diff =
    percentageDifference(currentUniswapPrice, currentUniswapV3Price) * 100;
  console.log({ percent_diff });

  if (percent_diff < 7.68) {
    return;
  }

  if (currentUniswapPrice > currentUniswapV3Price) {
    if (simulateArbitrage(amount0, true) > amount0) {
      await doArbitrage(amount0, true);
    }
  } else {
    if (simulateArbitrage(amount0, false) > amount0) {
      await doArbitrage(amount0, false);
    }
  }
}

// Start both price feeds
startUniswapPriceFeed();
startUniswapV3PriceFeed();
