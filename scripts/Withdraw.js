const { deployments, ethers, getNamedAccounts, network } = require("hardhat");

async function main() {
  const deployer = (await getNamedAccounts()).deployer;
  const fundMe = await ethers.getContract("Fundme", deployer);
  console.log("Funding contract....");
  const txResponse = await fundMe.withdraw({
    gasLimit: 1000000,
  });
  await txResponse.wait(1);
  console.log("Git it back");
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
