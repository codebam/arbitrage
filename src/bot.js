import "dotenv/config";
import { doArbitrage, getPoolPrice, pancakeGetPrice, percentageDifference } from "./modules/utils.js";


let times = 0;
while (true) {
  const prices = await Promise.all([getPoolPrice(), pancakeGetPrice()]);
  const uniswap_price = prices[0];
  const uniswapv3_price = prices[1];
  console.log({ uniswap_price, uniswapv3_price });

  const amount0 = 3000000000;

  const diff =
    Math.max(uniswap_price, uniswapv3_price) -
    Math.min(uniswap_price, uniswapv3_price);
  const percent_diff =
    percentageDifference(uniswap_price, uniswapv3_price) * 100;
  console.log({ percent_diff });
  if (percent_diff < 4.71) {
    times = 0;
    continue;
  }

  times = times + 1;
  if (times < 25) {
    continue;
  }

  if (uniswap_price > uniswapv3_price) {
    await doArbitrage(amount0, false);
    // await new Promise((r) => setTimeout(r, 10000));
    times = -25;
  } else {
    await doArbitrage(amount0, true);
    // await new Promise((r) => setTimeout(r, 10000));
    times = -25;
  }
}
