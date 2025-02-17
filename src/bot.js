import "dotenv/config";
import config from "../config.json" with { type: "json" };
import { Trade, Pool, Hook } from "@uniswap/v4-sdk";
import { Price, Token, NativeCurrency, ChainId } from "@uniswap/sdk-core";
import { Alchemy, Network, Contract } from "alchemy-sdk";
import { ethers } from "ethers";
// import IERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json" with { type: "json" };

const alchemy = new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ARB_MAINNET,
});

const WETH_ADDR = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
const USDC_ADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const ETH = new NativeCurrency(ChainId.ARBITRUM_ONE, 18);
const USDC = new Token(ChainId.ARBITRUM_ONE, USDC_ADDR, 6);
const POOL_MANAGER_ADDRESS = "0x360e68faccca8ca495c1b759fd9eee466db9fb32";
const POOL_MANAGER_ABI = [
    "function getPoolState(bytes32 poolId) external view returns (uint160 sqrtPriceX96, int24 tick, uint128 liquidity)",
];
const provider = await alchemy.config.getProvider();
const poolManager = new Contract(
    POOL_MANAGER_ADDRESS,
    POOL_MANAGER_ABI,
    provider,
);

function getPoolId(
    token0,
    token1,
    fee,
    hookAddress = ethers.constants.AddressZero,
) {
    const abiCoder = ethers.utils.defaultAbiCoder;
    return ethers.utils.keccak256(
        abiCoder.encode(
            ["address", "address", "uint24", "address"],
            [token0, token1, fee, hookAddress],
        ),
    );
}

const POOL_FEE = 500; // 0.05%
const POOL_ID = getPoolId(WETH_ADDR, USDC_ADDR, POOL_FEE);

async function getPoolState() {
    const [sqrtPriceX96, tick, liquidity] =
        await poolManager.getPoolState(POOL_ID);
    return { sqrtPriceX96, tick, liquidity };
}

async function getEthUsdcPrice() {
    const { sqrtPriceX96, liquidity, tick } = await getPoolState();
    const pool = new Pool(
        ETH,
        USDC,
        POOL_FEE,
        sqrtPriceX96.toString(),
        liquidity.toString(),
        tick,
    );
    console.log(`1 USDC = ${pool.token0Price.toSignificant(6)} ETH`);
    console.log(`1 ETH = ${pool.token1Price.toSignificant(6)} USDC`);
}

getEthUsdcPrice();

// const USDC_ETH = new Pool(ETH, USDC, fee);

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
