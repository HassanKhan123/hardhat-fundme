const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");

const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Fundme", async () => {
      let fundMe;
      let deployer;

      const sendValue = ethers.utils.parseEther("0.01");

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("Fundme", deployer);
      });

      it("allows people to fund and withdraw", async () => {
        await fundMe.fund({ value: sendValue });
        const txResponse = await fundMe.withdraw({
          gasLimit: 100000,
        });
        // await txResponse.wait(1);
        const contractEndingBalance = await ethers.provider.getBalance(
          fundMe.address
        );
        console.log("contractEndingBalance", contractEndingBalance.toString());

        assert.equal(contractEndingBalance.toString(), "0");
      });
    });
