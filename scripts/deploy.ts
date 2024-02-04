import {ethers, upgrades} from 'hardhat';

async function main() {
  const factory = await ethers.getContractFactory('ERC20');
  console.log('Deploying ERC20...');

  const contract = await upgrades.deployProxy(factory, [], {
    initializer: 'initialize',
    kind: 'transparent',
  });
  await contract.waitForDeployment();
  console.log('ERC20 deployed to:', await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
