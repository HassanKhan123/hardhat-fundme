const { deployments, ethers, getNamedAccounts, network } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const fundMe = await ethers.getContract("Fundme", deployer);
  console.log("Funding contract....");
  const txResponse = await fundMe.fund({
    value: ethers.utils.parseEther("10"),
    gasLimit: 1000000,
  });
  await txResponse.wait(1);
  console.log("Funded");
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
