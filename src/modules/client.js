
import {
  createPublicClient,
  http,
  createWalletClient,
} from "viem";
import { arbitrum } from "viem/chains";

export const client = createPublicClient({
  chain: arbitrum,
  transport: http(
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
  // transport: http(
  //     `https://virtual.arbitrum.rpc.tenderly.co/ae445137-8eb0-478d-ba2a-7ac3b1f7d14b`,
  // ),
});

export const walletClient = createWalletClient({
  chain: arbitrum,
  transport: http(
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
  // transport: http(
  //     `https://virtual.arbitrum.rpc.tenderly.co/ae445137-8eb0-478d-ba2a-7ac3b1f7d14b`,
  // ),
});