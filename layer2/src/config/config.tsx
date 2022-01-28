import {
  Config,
  getExplorerAddressLink,
  getExplorerTransactionLink,
  Mainnet,
  Rinkeby,
  DAppProvider,
} from '@usedapp/core';
import { Interface, Fragment, JsonFragment } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { ERC20 } from '../abis';
import React from 'react';

// TODO: create class, take in vars from constructor

export const CHAIN_ID = 4;
export const NODE_URL =
  'https://eth-rinkeby.alchemyapi.io/v2/f6UW9EauWWDD4JL4bHcsY76Cf5wiq-xk';
export const IS_PROD = process.env.NODE_ENV === 'production';

//ADDRESSES
export const ERC_20_ADDRESS = '0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658';

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
    autoConnect: false,
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

// TODO: find correct type for children
export function Layer2Provider({ children }: any) {
  const config = getConfig();
  return <DAppProvider config={config}>{children}</DAppProvider>;
}
