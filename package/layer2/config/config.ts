import {
  Config,
  getExplorerAddressLink,
  getExplorerTransactionLink,
  Mainnet,
  Rinkeby,
} from '@usedapp/core';
import { Interface, Fragment, JsonFragment } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { ERC20 } from '../abis';

export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID as string);
export const NODE_URL = process.env.REACT_APP_RPC_ENDPOINT as string;
export const IS_PROD = process.env.NODE_ENV === 'production';

//ADDRESSES
export const ERC_20_ADDRESS = process.env.REACT_APP_ERC20_ADDRESS as string; // cannot be undefined

//TODO: delete this on clean up
console.table({
  chainID: CHAIN_ID,
  node_URL: NODE_URL,
  is_prod: IS_PROD,
  erc20_address: ERC_20_ADDRESS,
});

export const tokenAddresses = {
  erc20: ERC_20_ADDRESS,
};

export const tokenDecimals = {
  erc20: 18,
  eth: 18,
};

export enum TokenNames {
  eth = 'eth',
  erc20 = 'erc20',
}

export const chainToNetwork = {
  1: Mainnet,
  4: Rinkeby,
};

export const validTokenList = ['eth', 'erc20'];

// return user's address page on Etherscan
export const blockExplorerAddressLink = (
  address: string
): string | undefined => {
  return getExplorerAddressLink(address, CHAIN_ID);
};

// return user's transaction info page on Etherscan
export const blockExplorerTransactionLink = (
  transactionHash: string
): string | undefined => {
  return getExplorerTransactionLink(transactionHash, CHAIN_ID);
};

// pass in [JSON].abi
export const loadInterface = (
  abi: string | ReadonlyArray<Fragment | JsonFragment | string>
): Interface => {
  return new Interface(abi);
};

export const loadContract = (
  abi: string | ReadonlyArray<Fragment | JsonFragment | string>,
  address: string
): Contract => {
  const contractInterface = loadInterface(abi);
  const contract = new Contract(address, contractInterface);

  return contract;
};

export const interfaces: { [key: string]: Interface } = {
  erc20Interface: loadInterface(ERC20),
};

export const contracts: { [key: string]: Contract } = {
  erc20Contract: loadContract(ERC20, ERC_20_ADDRESS),
};

export const getConfig = (): Config => {
  return {
    notifications: {
      expirationPeriod: 30000,
      checkInterval: 2000,
    },
    readOnlyChainId: CHAIN_ID,
    readOnlyUrls: {
      [CHAIN_ID]: NODE_URL,
    },
  };
};
