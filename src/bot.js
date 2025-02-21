import "dotenv/config";
import {
    createPublicClient,
    http,
    getContract,
    createWalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";
import { ethers } from "ethers";

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
    const [sqrtPriceX96, tick, protocolFee, lpFee] =
        await stateView.read.getSlot0([POOL_ID]);
    const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
    return price;
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
    const [sqrtPriceX96] = await poolContract.read.slot0();
    const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
    return price;
}

const ARBITRAGE_CONTRACT_ADDR = "0xcEe7791667485faa486Bce5a134EDD2DEbc2cbaD";
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

async function doArbitrage(amount, startOnUniswap) {
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

function percentageDifference(price1, price2) {
    return (Math.abs(price1 - price2) / Math.min(price1, price2)) * 100;
}

let times = 0;
while (true) {
    const prices = await Promise.all([getPoolPrice(), pancakeGetPrice()]);
    const uniswap_price = prices[0];
    const uniswapv3_price = prices[1];
    console.log({ uniswap_price, uniswapv3_price });

    const amount0 = 800000000;

    const diff =
        Math.max(uniswap_price, uniswapv3_price) -
        Math.min(uniswap_price, uniswapv3_price);
    const percent_diff =
        percentageDifference(uniswap_price, uniswapv3_price) * 100;
    console.log({ percent_diff });
    if (percent_diff < 2.5) {
        times = 0;
        continue;
    }

    times = times + 1;
    if (times < 10) {
        continue;
    }

    if (uniswap_price > uniswapv3_price) {
        await doArbitrage(amount0, false);
    } else {
        await doArbitrage(amount0, true);
    }
    await new Promise((r) => setTimeout(r, 10000));
}
