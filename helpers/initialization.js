require("dotenv").config()

const { Alchemy, Network } = require('alchemy-sdk');
const config = require('../config.json')
const settings = {
    apiKey: process.env.ALCHEMY_API_ARBITRUM,
    network: Network.ARB_MAINNET
};
const alchemy = new Alchemy(settings);
const IArbitrage = require('../artifacts/contracts/Arbitrage.sol/Arbitrage.json')

module.exports = {
  alchemy,
  uFactory,
  uRouter,
  pFactory,
  pRouter,
  arbitrage,
}
