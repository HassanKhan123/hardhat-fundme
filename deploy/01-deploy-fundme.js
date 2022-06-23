const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async ({ getNamedAccouts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccouts();
  const chainId = network.config.chainId;

  const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

  const fundMe = await deploy("Fundme", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    logs: true,
  });
};
