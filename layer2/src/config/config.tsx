import {
  Config,
  getExplorerAddressLink,
  getExplorerTransactionLink,
  DAppProvider,
} from '@usedapp/core';
import { Interface, Fragment, JsonFragment } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { ERC20 } from '../abis';
import { ReactNode } from 'react';
import { Wallet, initializeWallets } from './wallets';

// Interfaces

interface ProviderProps {
  children?: ReactNode;
}

// use this interface for type assertion inside addERC20ToMetamask()
interface WatchAssetParams {
  type: string; // In the future, other standards will be supported
  options: {
    address: string; // The address of the token contract
    symbol: string; // A ticker symbol or shorthand, up to 5 characters
    decimals: number; // The number of token decimals
    image: string; // A string url of the token logo
  };
}

export interface Info {
  name: string;
  symbol?: string;
  decimals?: number;
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
}

interface ProviderProps {
  children?: ReactNode;
}

export class Layer2 {
  public CHAIN_ID: number;
  public NODE_URL: string;
  public wallets: Wallet[];
  public chainIdToNetworkInfo: { [network: string]: Info };
  public config: Config;

  constructor(chainID: number, nodeURL: string) {
    this.CHAIN_ID = chainID;
    this.NODE_URL = nodeURL;
    this.wallets = initializeWallets(chainID);

    this.config = {
      autoConnect: false,
      notifications: {
        expirationPeriod: 30000,
        checkInterval: 2000,
      },
      readOnlyChainId: this.CHAIN_ID,
      readOnlyUrls: {
        [this.CHAIN_ID]: this.NODE_URL,
      },
    };

    this.chainIdToNetworkInfo = {
      1: {
        name: 'mainnet',
        symbol: 'ETH',
        decimals: 18,
        rpcUrls: [this.NODE_URL],
        blockExplorerUrls: ['https://etherscan.io/'],
      },
    };
  }

  // pre-fill config values for context provider.
  // wrap your application with this
  Provider = ({ children }: ProviderProps) =>
    DAppProvider({ config: this.config, children: children });

  printVars(): void {
    console.table({
      chainID: this.CHAIN_ID,
      node_URL: this.NODE_URL,
    });
  }

  // return user's address page on Etherscan
  blockExplorerAddressLink = (address: string): string | undefined => {
    return getExplorerAddressLink(address, this.CHAIN_ID);
  };

  // return user's transaction info page on Etherscan
  blockExplorerTransactionLink = (
    transactionHash: string
  ): string | undefined => {
    return getExplorerTransactionLink(transactionHash, this.CHAIN_ID);
  };

  // pass in [JSON].abi
  public loadInterface = (
    abi: string | ReadonlyArray<Fragment | JsonFragment | string>
  ): Interface => {
    return new Interface(abi);
  };

  // pass in [JSON].abi & address
  public loadContract = (
    abi: string | ReadonlyArray<Fragment | JsonFragment | string>,
    address: string
  ): Contract => {
    const contractInterface = this.loadInterface(abi);
    const contract = new Contract(address, contractInterface);

    return contract;
  };

  interfaces: { [key: string]: Interface } = {
    erc20Interface: this.loadInterface(ERC20),
  };

  // contracts: { [key: string]: Contract } = {
  //   erc20Contract: this.loadContract(ERC20, ERC_20_ADDRESS),
  // };

  public addTokenToMetamask = async (
    library: any,
    address: string,
    decimals: number
  ): Promise<boolean> => {
    try {
      const result = await library.provider?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: address,
            symbol: 'ERC_20',
            decimals: decimals,
          },
        } as WatchAssetParams,
      });

      return result;
    } catch (error) {
      return false;
    }
  };
}

// const layer2 = new Layer2(
//   4,
//   'https://eth-rinkeby.alchemyapi.io/v2/f6UW9EauWWDD4JL4bHcsY76Cf5wiq-xk'
// );

// // export const CHAIN_ID = 4;
// // export const NODE_URL =
// //   'https://eth-rinkeby.alchemyapi.io/v2/f6UW9EauWWDD4JL4bHcsY76Cf5wiq-xk';
// // export const IS_PROD = process.env.NODE_ENV === 'production';

// //ADDRESSES
// export const ERC_20_ADDRESS = '0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658';

// export const tokenDecimals = {
//   erc20: 18,
//   eth: 18,
// };

// export enum TokenNames {
//   eth = 'eth',
//   erc20 = 'erc20',
// }

// export const chainToNetwork = {
//   1: Mainnet,
//   4: Rinkeby,
// };

// export const validTokenList = ['eth', 'erc20'];
