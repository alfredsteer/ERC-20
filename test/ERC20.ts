import {expect} from 'chai';
import {ethers, upgrades} from 'hardhat';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';

describe('ERC20', function () {
  async function deployERC20Fixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const factory = await ethers.getContractFactory('ERC20');

    const contract = await upgrades.deployProxy(factory, [], {
      initializer: 'initialize',
      kind: 'transparent',
    });
    await contract.waitForDeployment();

    return {contract, owner, otherAccount};
  }

  describe('Deployment amd mint', function () {
    it('Should equal contract owner and owner user', async () => {
      const {contract, owner} = await loadFixture(deployERC20Fixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it('Should transfer mint tokens to the owner', async function () {
      const {contract, owner} = await loadFixture(deployERC20Fixture);
      await contract.mint(owner.address, 100);
      expect(100).to.equal(Number(await contract.balanceOf(owner.address)));
    });

    it('Should assign the total supply of tokens to the owner', async function () {
      const {contract, owner} = await loadFixture(deployERC20Fixture);
      const total = await contract.totalSupply();
      expect(total).to.equal(await contract.balanceOf(owner.address));
    });
  });

  describe('Transaction', function () {
    it('Should transfer tokens between accounts', async function () {
      const {contract, owner, otherAccount} = await loadFixture(deployERC20Fixture);
      await contract.mint(owner.address, 100);
      await contract.transfer(otherAccount.address, 50);

      const otherAccountBalance = await contract.balanceOf(otherAccount.address);
      expect(Number(otherAccountBalance)).to.equal(50);

      const ownerNewBalance = await contract.balanceOf(owner.address);
      expect(Number(ownerNewBalance)).to.equal(50);
    });

    it('Should fail if sender doesn’t have enough tokens', async function () {
      const {contract, otherAccount} = await loadFixture(deployERC20Fixture);

      try {
        await contract.transfer(otherAccount.address, ethers.parseEther('10001'));
      } catch (error: any) {
        expect(error.message).to.contains('ERC20: transfer amount exceeds balance');
      }
    });
  });
});
