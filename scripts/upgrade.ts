import {ethers, upgrades} from 'hardhat';

async function main() {
  const factory = await ethers.getContractFactory('ERC20V2');
  console.log('Deploying ERC20 V2...');

  await upgrades.upgradeProxy('0x...', factory);
  console.log('Upgraded Successfully');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
