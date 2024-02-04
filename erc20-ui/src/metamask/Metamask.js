import {useState} from 'react';
import {ethers /*, verifyMessage */} from 'ethers';
import viewChainName from './ViewChainName';

const abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  'function transfer(address to, uint amount) returns (bool)',
  'function mint(address to, uint amount) returns (bool)',

  'event Transfer(address indexed from, address indexed to, uint amount)',
];

function Metamask() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [currentChainId, setCurrentChainId] = useState(-1);
  const [message, setMessage] = useState('');
  const [currentBalanceETH, setCurrentBalanceETH] = useState('');
  const [currentBalanceERC20, setCurrentBalanceERC20] = useState('');
  const [dontMint, setDontMint] = useState(true);
  const handleChangeDontMint = () => {
    setDontMint(!dontMint);
  };
  const [dontTransfer, setDontTransfer] = useState(true);
  const handleChangeDontTransfer = () => {
    setDontTransfer(!dontTransfer);
  };

  const switchNetwork = async (provider) => {
    if (typeof window?.ethereum !== 'undefined') {
      try {
        await provider.send('wallet_switchEthereumChain', [{chainId: '0x13881'}]);
      } catch (error) {
        if (error.code === 4902) {
          try {
            await provider.send('wallet_addEthereumChain', [
              {
                chainId: '0x13881',
                chainName: 'Polygon Testnet',
                rpcUrls: ['https://rpc.ankr.com/polygon_mumbai'],
                nativeCurrency: {
                  name: 'Mumbai Matic',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ]);
          } catch (error) {
            setMessage(error);
          }
        } else {
          setMessage(error);
        }
      }
    } else {
      setMessage('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    }
  };

  const ConnectWallet = async (provider) => {
    try {
      let {chainId} = await provider.getNetwork();
      if (parseInt(chainId, 16) !== 80001) {
        await switchNetwork(provider);
        chainId = await window.ethereum.request({method: 'eth_chainId'});
      }

      setCurrentChainId(() => parseInt(chainId, 16));

      const accounts = await provider.send('eth_requestAccounts');
      setCurrentAccount(accounts[0]);

      setIsLogged(true);

      let balanceETH = await provider.getBalance(accounts[0]);
      setCurrentBalanceETH(`${ethers.formatEther(balanceETH, 18)} ETH`);

      if (!dontMint) {
        try {
          const signerMint = await provider.getSigner();
          let contractMint = new ethers.Contract('0x...', abi, signerMint);
            const transactionMint = await contractMint.mint(
            '0x...',
            ethers.parseUnits(String(2), 18),
          );
          await transactionMint.wait();
          console.log(transactionMint.hash);
        } catch (error) {
          console.log(error.message);
        }
      }

      if (!dontTransfer) {
        try {
          const signerTransfer = await provider.getSigner();
          let contractTransfer = new ethers.Contract('0x...', abi, provider);
          const transactionTransfer = await contractTransfer
            .connect(signerTransfer)
            .transfer('0x...', ethers.parseUnits(String(1), 18));
          await transactionTransfer.wait();
          console.log(transactionTransfer.hash);
        } catch (error) {
          console.log(error.message);
        }
      }

      try {
        let contract = new ethers.Contract('0x...', abi, provider);
        const balanceERC20 = await contract.balanceOf(accounts[0]);
        setCurrentBalanceERC20(`${ethers.formatEther(balanceERC20, 18)} ERC20`);
      } catch (error) {
        console.log(error.message);
      }

      return accounts[0];
    } catch (err) {
      if (err.code === 4001) {
        setMessage('Please connect to MetaMask.');
      } else if (err.code === -32002) {
        setMessage('Please unlock MetaMask.');
      } else {
        setMessage(err);
      }
    }
  };

  const SignIn = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    if (!provider) {
      setMessage('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    } else {
      const address = await ConnectWallet(provider);

      if (address) {
        setMessage('');
      }
    }
  };

  const SignOut = async () => {
    setCurrentAccount('');
    setIsLogged(false);
    setCurrentChainId(-1);
    setMessage('');
    setCurrentBalanceETH('');
    setCurrentBalanceERC20('');
  };

  return (
    <>
      {!isLogged && (
        <>
          <div>
            <input type="checkbox" checked={dontMint} onChange={handleChangeDontMint} /> do not mint ERC20 coin when logging in
          </div>
          <div>
            <input type="checkbox" checked={dontTransfer} onChange={handleChangeDontTransfer} /> do not send ERC20 coin when logging in
          </div>
          <br />
          <button onClick={SignIn} disabled={isLogged}>
            LogIn
          </button>
        </>
      )}

      {isLogged && (
        <>
          {message !== '' ? message : `User adress: ${currentAccount === '' ? 'Unknown' : currentAccount}`}
          <br />
          Current chain: {viewChainName(currentChainId)}
          <br />
          Current balance ETH: {currentBalanceETH === '' ? 'Unknown' : currentBalanceETH}
          <br />
          Current balance ERC20: {currentBalanceERC20 === '' ? 'Unknown' : currentBalanceERC20}
          <br />
          <br />
          <button onClick={SignOut} disabled={!isLogged}>
            SignOut
          </button>
        </>
      )}
    </>
  );
}

export default Metamask;
