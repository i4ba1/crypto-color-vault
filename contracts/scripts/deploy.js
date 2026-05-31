const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log(
    "Balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address)),
    "ETH"
  );

  const CryptoColorVault = await ethers.getContractFactory("CryptoColorVault");
  const vault = await CryptoColorVault.deploy();
  await vault.waitForDeployment();

  console.log("CryptoColorVault deployed to:", await vault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
