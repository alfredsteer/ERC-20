# ERC20Coin

## Installing NodeJS on Linux

- `cd ~`
- `curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh`
- `sudo bash nodesource_setup.sh`
- `sudo apt-get install -y nodejs`
- `node -v`

## Installing libraries and dependencies

Since `@nomiclabs/hardhat-waffle` version 2.0.6 and `@nomiclabs/hardhat-ethers` version 2.2.3 did not update their dependencies from `ethers` version 5 to `ethers` version 6, you must use the flag: `--force`, when installing (it is important to use NodeJS v16.13.1, otherwise `force` will not work as expected):

- `npm install --force`

## Description of project files and folders

- `contracts`: folder for contract files.
- `erc20-ui`: UI project folder using React to display connected wallet data.
- `node_modules`: folder with NodeJS libraries.
- `scripts`: folder for smart contract deployment files.
- `test`: folder for smart contract test files.
- `.env` and `.env.example`: file for setting up a connection to the blockchain network and an example config file.
- `.gitignore`: list of files ignored when added to the GIT repository.
- `.prettierrc` and `.solhint.json`: static analysis and code formatting configuration file.
- `hardhat.config.js`: Hardhat project configuration file.
- `package.json`: a file describing the libraries used by NodeJS and the project launch command.
- `README.md`: this instruction.
- `tsconfig.json`: TypeScript configuration file.
- `yarn.lock`: a file with a description of all used NodeJS libraries installed in the `node_modules` folder.

## Notes

- `solhint-plugin-prettier` version 0.0.5 requires `prettier` version 2.8.8.

## Description of console commands used in the project

- `npm run check` - for static analysis and code formatting.
- `npm run clean`: to clear the cache and remove compiled smart contracts.
- `npm run test`: to run tests stored in the test folder.
- `npm run chain`: to run a local blockchain (run in a separate console).
- `npm run deploy`: to start deploying a smart contract to the local blockchain.

## Execution of local tests and local deployment of the smart contract, before deployment to the test network

- `npm run test`: to run tests stored in the test folder.
- `npm run chain`: to run a local blockchain (run in a separate console).
- `npm run deploy`: to start deploying a smart contract to the local blockchain.

## Installing and configuring the wallet before deploying it to the test network

- Download the browser extension from the URL: <https://metamask.io/download/>.
- Create a new wallet (if necessary) or import a test wallet from a secret phrase (it is from the test wallet that the smart contract will be deployed on the test network and only from it can you mint new coins on this contract): `swear, great, egg, ridge, unable, close, night, shock, decrease, color, direct, direct`.
- In the left corner of the wallet, click on the inscription: `Etherium Mainnet` and in the pop-up window that opens, select: `Show test networks`. Immediately click the button: “Add network”. In the window that opens, select: `Add a network manually`. And fill in the fields: `Network name` - `Mumbai Testnet`, `New RPC URL` - `https://rpc-mumbai.maticvigil.com/`, `Chain ID` - `80001`, `Currency symbol` - `MATIC`, `Block Explorer URL` - `https://polygonscan.com/`. Then click the button: “Save”. In the main window of the wallet, switch `Etherium Mainnet` to `Mumbai Testnet`.
- We receive several coins on the Polygon test network using the URL: <https://mumbaifaucet.com/>.
- Copy the private key from the wallet along the path: `Account` -> `Account details` -> `Show private key` and paste it into the file: `.env`.
- To deploy a smart contract on a test network, you will also need access to a blockchain node. To obtain it, we will use the service at URL: <https://www.infura.io/>. We register, confirm the e-mail, create a new project, connect the `Polygon` -> `Polygon PoS` plugin, bind the card and get access. Copy the `URL` for `Polygon` -> `Mumbai` and paste it into the file: `.env`.
- Let's uncomment the lines associated with the `networks` object in the `hardhat.config.ts` file (19-24).
- Let’s execute the command to deploy the smart contract to the test blockchain network: `npm run mumbai`.
- We wait for the message in the console: `ERC20 deployed to: 0x...`. In this case, the following will be spent: 0.0051 MATIC.
- Comment out in the `hardhat.config.ts` file the lines associated with the `networks` object (19-24). This is necessary for the `npm run check` command to work if the necessary data is not specified in the file: `.env`.
- You can view the details of the expanded contract at the URL: <https://mumbai.polygonscan.com/address/0x...>.
- To display tokens in metamask, select: `Import tokens` -> `Token contract address` - `0x...`.

## Updating the contract (if necessary)

- Copy the file `contracts\ERC20.sol` to `contracts\ERC20V2.sol` (or similar, for example: `contracts\ERC20V10.sol`).
- Changing the contract code: you need to change the class name in the contract code from `ERC20` to `ERC20V2` (the class name must match the file name, i.e. for `contracts\ERC20V10.sol` the class name will be: `ERC20V10`), We supplement the contract code with new necessary functions or correct existing ones.
- We make changes to the code of the file `scripts\upgrade.ts`. By changing the class name of the updated contract in the line: `const factory = await ethers.getContractFactory('ERC20V2');`, i.e. for `contracts\ERC20V10.sol` the class name will be: `ERC20V10` and this line will be updated to `const factory = await ethers.getContractFactory('ERC20V10');`. We will also replace (if necessary) the address of the already deployed contract in the line: `await upgrades.upgradeProxy('0x...', factory);`.
- Let's uncomment the lines associated with the `networks` object in the `hardhat.config.ts` file (19-24).
- Let’s execute the command to deploy the smart contract update to the test blockchain network: `npx hardhat run --network mumbai scripts/upgrade.ts`.
- We are waiting for the message in the console: `Upgraded Successfully`.
- Comment out in the `hardhat.config.ts` file the lines associated with the `networks` object (19-24). This is necessary for the `npm run check` command to work if the necessary data is not specified in the file: `.env`.

## Frontend for the contract

- Go to the `erc20-ui` folder.
- Install libraries and dependencies with the command: `npm install`.
- Review the comments and change (if necessary) the blockchain network, contract address and contract owner in the file: `erc20-ui\src\metamask\Metamask.js`.
- Start the frontend with the command: `npm run start`.
- Open the URL in your browser: `http://localhost:3000/`.
- Test working with the contract in the browser, if necessary.
