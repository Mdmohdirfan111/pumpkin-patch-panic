// scripts/deploy.js
const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const PumpkinPatchPanic = await hre.ethers.getContractFactory('PumpkinPatchPanic');
  const contract = await PumpkinPatchPanic.deploy();

  await contract.waitForDeployment();
  console.log('PumpkinPatchPanic deployed to:', await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });