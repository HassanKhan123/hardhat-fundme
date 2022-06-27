const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { ETHERSCAN_API_KEY } = require("../secret");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAddress];
  const fundme = await deploy("Fundme", {
    from: deployer,
    args,
    log: true,
    waitConfirmation: network.config.blockConfirmations || 5,
  });

  if (!developmentChains.includes(network.name) && ETHERSCAN_API_KEY) {
    await verify(fundme.address, args);
  }

  log("Fundme Deployed");
};

module.exports.tags = ["all", "fundme"];
