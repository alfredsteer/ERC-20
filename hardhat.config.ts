import {HardhatUserConfig} from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@openzeppelin/hardhat-upgrades';
import '@nomiclabs/hardhat-solhint';

import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  // networks: {
  //   mumbai: {
  //     url: String(process.env.URL),
  //     accounts: [String(process.env.PRIVATE_KEY)],
  //   },
  // },
};

export default config;
