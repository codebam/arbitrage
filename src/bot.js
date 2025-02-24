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
import {
    STATEVIEW_ABI,
    V3_POOL_ABI,
    ARBITRAGE_CONTRACT_ABI,
    POSITION_MANAGER_ABI,
    V4_QUOTER_ABI,
    V3_QUOTER_ABI,
    VAULT_ABI,
} from "./abi.js";

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

const V3_POOL_ADDR = "0xC6962004f452bE9203591991D15f6b388e09E8D0";
const poolContract = getContract({
    address: V3_POOL_ADDR,
    abi: V3_POOL_ABI,
    client,
});

// Call this to get the ETH price on Pancakeswap
async function v3GetPrice() {
    try {
        const [sqrtPriceX96] = await poolContract.read.slot0();
        const price = (Number(sqrtPriceX96) ** 2 / 2 ** 192) * 10 ** 12;
        return price;
    } catch (e) {
        console.log(e);
    }
}

const ARBITRAGE_CONTRACT_ADDR = "0x1aD76Ea947A6C602F35D3e6AE284758ae226fa2d";

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

const V4_QUOTER = "0x3972c00f7ed4885e145823eb7c655375d275a1c5";

async function quoteExactInputSingle(
    poolKey,
    zeroForOne,
    exactAmount,
    hookData,
) {
    const result = await client.readContract({
        address: V4_QUOTER,
        abi: V4_QUOTER_ABI,
        functionName: "quoteExactInputSingle",
        args: [{ poolKey, zeroForOne, exactAmount, hookData }],
    });
    return result[0];
}

const V3_QUOTER = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

const VAULT = "0xbA1333333333a1BA1108E8412f11850A5C319bA9";

async function quoteExactInputSingleV3(
    tokenIn,
    tokenOut,
    fee,
    amountIn,
    sqrtPriceLimitX96,
) {
    const result = await client.readContract({
        address: V3_QUOTER,
        abi: V3_QUOTER_ABI,
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
        const uniswapv3_price = await v3GetPrice();

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
