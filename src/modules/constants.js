import { positionManager } from "../abi/position.js";

export const WETH_ADDR = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
export const USDC_ADDR = "0xaf88d065e77c8cc2239327c5edb3a432268e5831";

export const POOL_ID =
  "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf89aaf579e903a8";


export const poolId = "0x864abca0a6202dba5b8868772308da953ff125b0f95015adbf";
export const poolKey = await positionManager.read.poolKeys([poolId]);

export const owner = "0x655815CFaC22597C4339B76A8B7f8f3da6e648cD";
export const uRouter = "0x6ff5693b99212da76ad316178a184ab56d299b43";
export const pRouter = "0x1b81D678ffb9C0263b24A97847620C99d213eB14";
