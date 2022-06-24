const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert } = require("chai");

describe("Fundme", async () => {
  let fundMe;
  let deployer;
  let mockV3Aggregator;

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("Fundme", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", async () => {
    it("sets the aggregator address correctly", async () => {
      const response = await fundMe.priceFeed();
      console.log(response, mockV3Aggregator.address);
      assert.equal(response, mockV3Aggregator.address);
    });
  });
});
