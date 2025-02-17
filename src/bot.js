import "dotenv/config";
import { NativeCurrency, Token, ChainId } from "@uniswap/sdk-core";
import {
  createPublicClient,
  http,
  getContract,
  encodeAbiParameters,
  parseUnits,
} from "viem";
import { arbitrum } from "viem/chains";
import { ethers } from "ethers";

const client = createPublicClient({
  chain: arbitrum,
  transport: http(),
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

const WETH_ADDR = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"; // WETH address
const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC address
const ETH = new NativeCurrency(ChainId.ARBITRUM_ONE, 18);
const USDC = new Token(ChainId.ARBITRUM_ONE, USDC_ADDR, 6);

const POOL_ID =
  "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8";
console.log("Pool ID:", POOL_ID);

async function getPoolPrice() {
  const [sqrtPriceX96, tick, protocolFee, lpFee] =
    await stateView.read.getSlot0([POOL_ID]);
  const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
  return price;
}

const PANCAKE_POOL_ADDR = "0x7fcdc35463e3770c2fb992716cd070b63540b947";
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
        internalType: "uint32",
        name: "feeProtocol0Old",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "feeProtocol1Old",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "feeProtocol0New",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "feeProtocol1New",
        type: "uint32",
      },
    ],
    name: "SetFeeProtocol",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "SetLmPoolEvent",
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
      {
        indexed: false,
        internalType: "uint128",
        name: "protocolFeesToken0",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "protocolFeesToken1",
        type: "uint128",
      },
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
    name: "lmPool",
    outputs: [
      { internalType: "contract IPancakeV3LmPool", name: "", type: "address" },
    ],
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
      { internalType: "uint32", name: "feeProtocol0", type: "uint32" },
      { internalType: "uint32", name: "feeProtocol1", type: "uint32" },
    ],
    name: "setFeeProtocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_lmPool", type: "address" }],
    name: "setLmPool",
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
      { internalType: "uint32", name: "feeProtocol", type: "uint32" },
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

async function pancakeGetPrice() {
  const [sqrtPriceX96] = await poolContract.read.slot0();
  const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
  return price;
}

// Trade.bestTradeExactIn([
//     new Pool("0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"),
// ]);

// let uPair,
//   pPair,
//   amount,
//   uRate,
//   pRate,
//   price,
//   uPrice,
//   pPrice,
//   attempts = 0,
//   success = 0;
// let isExecuting = false;

// const uniswap = new Trade();

// -- .ENV VALUES HERE -- //
// const arbFor = process.env.ARB_FOR; // This is the address of token we are attempting to arbitrage (WETH)
// const arbAgainst = process.env.ARB_AGAINST; // token1 address
// const units = process.env.UNITS; // Used for price display/reporting
// const difference = process.env.PRICE_DIFFERENCE;
// const gasLimit = 1600000; // process.env.GAS_LIMIT
// const gasPrice = process.env.GAS_PRICE; // Estimated Gas: 0.008453220000006144 ETH + ~10%

// const main = async () => {
//   if (config.PROJECT_SETTINGS.isLocal) {
//     console.log("Running on Localhost");
//   } else {
//     console.log("Running on Live Net");
//   }

//   const { token0Contract, token1Contract, token0, token1 } =
//     await getTokenAndContract(arbFor, arbAgainst, provider);
//   uPair = await getPairContract(
//     uFactory,
//     token0.address,
//     token1.address,
//     provider,
//   );
//   sPair = await getPairContract(
//     sFactory,
//     token0.address,
//     token1.address,
//     provider,
//   );

//   console.log(`Uniswap Address: \t${await uPair.getAddress()}`);
//   console.log(`Pancakeswap Address: \t${await pPair.getAddress()}\n`);

//   // Get the Price on Uniswap
//   uPrice = await getV3Price(uFactory, arbFor, arbAgainst, provider);
//   console.log(
//     `This is the price on Uniswap: \t${uPrice} ${token1.symbol}/${token0.symbol}`,
//   );
//   // Get the Price on Sushiswap
//   sPrice = await getV3Price(sFactory, arbAgainst, arbFor, provider);
//   console.log(
//     `This is the price on Pancakeswap: ${pPrice} ${token1.symbol}/${token0.symbol}`,
//   );

//   // Initial Price difference
//   const priceDifference = (uPrice / pPrice) * 100 - 100;
//   console.log(
//     `This is the Price Difference: \t${priceDifference.toFixed(4)}%\n`,
//   );

//   // Get the Quoter Contract on Sushiswap
//   const pQuoter = new ethers.Contract(pQuoteAddress, QuoterV2.abi, provider);
//   // Get the Quoter Contract on Uniswap
//   const uQuoter = new ethers.Contract(uQuoteAddress, QuoterV2.abi, provider);

//   uPair.on("Swap", async () => {
//     if (!isExecuting) {
//       isExecuting = true;
//       attempts += 1;
//       console.log("A Swap Event has occurred on Uniswap. Getting quote...");
//       let result = await quoteSwap();
//       if (result.profitable) {
//         console.log(`Profitable: \t${result.profitable}`);
//         console.log(`Ideal Amount In: \t${result.bestAmount}`);
//         console.log(`Start on Uni: \t${result.startOnUni}`);
//         console.log("Proceeding...");

//         // Make signer from Private Key account
//         const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//         // Fetch token balances before
//         const tokenBalanceBefore = await token0Contract.balanceOf(
//           signer.address,
//         );
//         const ethBalanceBefore = await provider.getBalance(signer.address);
//         console.log(ethers.formatEther(ethBalanceBefore));

//         if (config.PROJECT_SETTINGS.isDeployed) {
//           const tx = await arbitrageV3
//             .connect(signer)
//             .executeTrade(
//               result.startOnUni,
//               token0.address,
//               token1.address,
//               result.bestAmount,
//               { gasLimit: gasLimit },
//             );

//           const receipt = await tx.wait();
//           success += 1;
//           console.log(
//             `type: ${receipt.type} ${receipt.type == 2 ? console.log("Execute Trade Success") : console.log("Execute trade Failed")}`,
//           );
//         }
//         const tokenBalanceAfter = await token0Contract.balanceOf(
//           signer.address,
//         );
//         const ethBalanceAfter = await provider.getBalance(signer.address);

//         const tokenBalanceDifference = tokenBalanceAfter - tokenBalanceBefore;
//         const ethBalanceDifference = ethBalanceBefore - ethBalanceAfter;

//         const data = {
//           "ETH Balance Before": ethers.formatUnits(ethBalanceBefore, "ether"), // should be 0
//           "ETH Balance After": ethers.formatUnits(ethBalanceAfter, "ether"),
//           "ETH Spent (gas)": ethers.formatUnits(
//             ethBalanceDifference.toString(),
//             "ether",
//           ),
//           "-": {},
//           "WETH Balance BEFORE": ethers.formatUnits(
//             tokenBalanceBefore,
//             "ether",
//           ),
//           "WETH Balance AFTER": ethers.formatUnits(tokenBalanceAfter, "ether"),
//           "WETH Gained/Lost": ethers.formatUnits(
//             tokenBalanceDifference.toString(),
//             "ether",
//           ),
//           "-": {},
//           "Total Gained/Lost": `${ethers.formatUnits((tokenBalanceDifference - ethBalanceDifference).toString(), "ether")} ETH`,
//         };

//         console.table(data);
//       }
//       isExecuting = false;
//       console.log(
//         `Is Executing: ${isExecuting} \nAttempts: ${success}/${attempts}\nWaiting for next Swap Event...\n`,
//       );
//     }
//   });

//   pPair.on("Swap", async () => {
//     if (!isExecuting) {
//       isExecuting = true;
//       attempts += 1;
//       console.log("A Swap Event has occurred on Uniswap. Getting quote...");
//       let result = await quoteSwap();
//       if (result.profitable) {
//         console.log(`Profitable: \t${result.profitable}`);
//         console.log(`Ideal Amount In: \t${result.bestAmount}`);
//         console.log(`Start on Uni: \t${result.startOnUni}`);
//         console.log("Proceeding...");

//         // Make signer from Private Key account
//         const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//         // Fetch token balances before
//         const tokenBalanceBefore = await token0Contract.balanceOf(
//           signer.address,
//         );
//         const ethBalanceBefore = await provider.getBalance(signer.address);

//         if (config.PROJECT_SETTINGS.isDeployed) {
//           const tx = await arbitrageV3
//             .connect(signer)
//             .executeTrade(
//               result.startOnUni,
//               token0.address,
//               token1.address,
//               result.bestAmount,
//               { gasLimit: gasLimit },
//             );

//           const receipt = await tx.wait();
//           success += 1;
//           console.log(
//             `type: ${receipt.type} ${receipt.type == 2 ? console.log("Execute Trade Success") : console.log("Execute trade Failed")}`,
//           );
//         }
//         const tokenBalanceAfter = await token0Contract.balanceOf(
//           signer.address,
//         );
//         const ethBalanceAfter = await provider.getBalance(signer.address);

//         const tokenBalanceDifference = tokenBalanceAfter - tokenBalanceBefore;
//         const ethBalanceDifference = ethBalanceBefore - ethBalanceAfter;

//         const data = {
//           "ETH Balance Before": ethers.formatUnits(ethBalanceBefore, "ether"), // should be 0
//           "ETH Balance After": ethers.formatUnits(ethBalanceAfter, "ether"),
//           "ETH Spent (gas)": ethers.formatUnits(
//             ethBalanceDifference.toString(),
//             "ether",
//           ),
//           "-": {},
//           "WETH Balance BEFORE": ethers.formatUnits(
//             tokenBalanceBefore,
//             "ether",
//           ),
//           "WETH Balance AFTER": ethers.formatUnits(tokenBalanceAfter, "ether"),
//           "WETH Gained/Lost": ethers.formatUnits(
//             tokenBalanceDifference.toString(),
//             "ether",
//           ),
//           "-": {},
//           "Total Gained/Lost": `${ethers.formatUnits((tokenBalanceDifference - ethBalanceDifference).toString(), "ether")} ETH`,
//         };

//         console.table(data);
//       }
//       isExecuting = false;
//       console.log(
//         `Is Executing: ${isExecuting} \nAttempts: ${success}/${attempts}\nWaiting for next Swap Event...\n`,
//       );
//     }
//   });

//   const quoteSwap = async () => {
//     let profit,
//       profitable,
//       amountOut,
//       best = 0,
//       exchangeA,
//       exchangeB,
//       bestAmount = 0;

//     // Get the Price on Uniswap
//     uPrice = await getV3Price(uFactory, arbFor, arbAgainst, provider);
//     console.log(
//       `This is the price on Uniswap: \t${uPrice} ${token1.symbol}/${token0.symbol}`,
//     );
//     // Get the Price on Sushiswap
//     pPrice = await getV3Price(sFactory, arbFor, arbAgainst, provider);
//     console.log(
//       `This is the price on Sushiswap: ${sPrice} ${token1.symbol}/${token0.symbol}`,
//     );
//     // Determine the Price difference
//     const priceDifference = (uPrice / pPrice) * 100 - 100;
//     console.log(
//       `This is the Price Difference: \t${priceDifference.toFixed(4)}%\n`,
//     );

//     // Determine which exchange to start on
//     if (uPrice >= pPrice) {
//       console.log("Buy on Uniswap, Sell on Pancakeswap");
//       exchangeA = uQuoter;
//       exchangeB = pQuoter;
//       startOnUni = true;
//     } else {
//       console.log("Buy on Pancakeswap, Sell on Uniswap");
//       exchangeA = pQuoter;
//       exchangeB = uQuoter;
//       startOnUni = false;
//     }

//     const fee = 3000;
//     let amountIn = 100000000000000000n;

//     // Loop through a series of amountIns to find the most profitable
//     for (let i = 0; i < 20; i++) {
//       console.log(
//         `----------------------------i=${i} -------- amountIn=${amountIn} (${ethers.formatEther(amountIn)})----------------------------`,
//       );
//       let quote1 = await getQuote(exchangeA, arbFor, arbAgainst, amountIn, fee);
//       let quote2 = await getQuote(
//         exchangeB,
//         arbAgainst,
//         arbFor,
//         quote1.amountOut,
//         fee,
//       );
//       profit = quote2.amountOut - amountIn;
//       console.log(`Profit: ${ethers.formatEther(profit)}`);
//       if (profit > best) {
//         best = profit;
//         bestAmount = amountIn;
//         console.log(`New Profit: ${profit} <<<<<<<<<<<<<<<<<<<<<<<<<<<`);
//       }
//       amountIn += 100000000000000000n;
//     }
//     console.log(`\nBest: ${best}\n`);

//     //
//     if (best > 0) {
//       console.log(
//         `Potential arbitrage profit of ${ethers.formatEther(best)}` +
//           ` available using ${ethers.formatEther(bestAmount)}${token0.symbol}` +
//           ` for a ${priceDifference.toFixed(4)}% price difference. \nProceeding with swap!\n`,
//       );
//       profitable = true;
//       return { profitable, bestAmount, startOnUni };
//     } else {
//       console.log(`Arbitrage quote is not in profit. Cancelling attempt.\n`);
//       profitable = false;
//       return { profitable, bestAmount, startOnUni };
//     }
//   };
// };

// main();
