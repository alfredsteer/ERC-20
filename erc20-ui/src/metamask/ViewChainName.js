const viewChainName = (chainId) => {
  let chainName;

  switch (chainId) {
    case 1:
      chainName = 'Ethereum Mainnet network';
      break;
    case 137:
      chainName = 'Polygon Mainnet network';
      break;
    case 80001:
      chainName = 'Polygon Testnet network';
      break;
    default:
      chainName = 'Unknown network';
      break;
  }

  return <>{chainName}</>;
};

export default viewChainName;
