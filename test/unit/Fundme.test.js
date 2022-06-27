const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("Fundme", async () => {
  let fundMe;
  let deployer;
  let mockV3Aggregator;
  const sendValue = ethers.utils.parseEther("30");

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    console.log("DEPLOYER=========", deployer);
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("Fundme", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", async () => {
    it("sets the aggregator address correctly", async () => {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe("fund", () => {
    it("Fails if not enough eth send", async () => {
      await expect(fundMe.fund()).to.be.reverted;
    });

    it("updated the amount funded data structure", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });

    it("Adds funders to array of funders", async () => {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.funders([0]);
      assert.equal(funder, deployer);
    });
  });

  describe("Withdraw", () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });

    it("Withdraw eth from a single funder", async () => {
      const contractStartingBalance = await ethers.provider.getBalance(
        fundMe.address
      );
      const deployerStartingBalance = await ethers.provider.getBalance(
        deployer
      );

      const txResponse = await fundMe.withdraw();
      const txReceipt = await txResponse.wait(1);

      const { gasUsed, effectiveGasPrice } = txReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const contractEndingBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const deployerEndingBalance = await fundMe.provider.getBalance(deployer);

      assert.equal(contractEndingBalance, 0);
      assert.equal(
        contractStartingBalance.add(deployerStartingBalance).toString(),
        deployerEndingBalance.add(gasCost).toString()
      );
    });
  });
});
