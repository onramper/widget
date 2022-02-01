import {
  Config,
  getExplorerAddressLink,
  getExplorerTransactionLink,
  DAppProvider,
  useEthers,
} from '@usedapp/core';
import { Interface, Fragment, JsonFragment } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { ERC20 } from '../abis';
import React, { createContext, ReactNode, useContext } from 'react';
import { Wallet, initializeWallets } from './wallets';

// Interfaces
interface ProviderProps {
  children?: ReactNode;
  layer2Args: Layer2Args;
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

interface Layer2Args {
  chainID: number;
  nodeURL: string;
}

export class Layer2 {
  public CHAIN_ID: number;
  public NODE_URL: string;
  public wallets: Wallet[];
  public chainIdToNetworkInfo: { [network: string]: Info };
  public config: Config;

  constructor({ chainID, nodeURL }: Layer2Args) {
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
  blockExplorerTransactionLink(transactionHash: string): string | undefined {
    return getExplorerTransactionLink(transactionHash, this.CHAIN_ID);
  }

  // pass in [JSON].abi
  public loadInterface(
    abi: string | ReadonlyArray<Fragment | JsonFragment | string>
  ): Interface {
    return new Interface(abi);
  }

  // pass in [JSON].abi & address
  public loadContract(
    abi: string | ReadonlyArray<Fragment | JsonFragment | string>,
    address: string
  ): Contract {
    const contractInterface = this.loadInterface(abi);
    const contract = new Contract(address, contractInterface);

    return contract;
  }

  interfaces: { [key: string]: Interface } = {
    erc20Interface: this.loadInterface(ERC20),
  };

  // contracts: { [key: string]: Contract } = {
  //   erc20Contract: this.loadContract(ERC20, ERC_20_ADDRESS),
  // };

  getUserAddress(): string | null | undefined {
    const { account } = useEthers();
    return account;
  }
}

interface ConfigArgs {
  chainID: number;
  nodeURL: string;
}

export const addTokenToMetamask = async (
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
          symbol: 'DAI',
          decimals: decimals,
        },
      } as WatchAssetParams,
    });

    return result;
  } catch (error) {
    return false;
  }
};

export const getConfig = ({ chainID, nodeURL }: ConfigArgs): Config => {
  return {
    autoConnect: false,
    notifications: {
      expirationPeriod: 30000,
      checkInterval: 2000,
    },
    readOnlyChainId: chainID,
    readOnlyUrls: {
      [chainID]: nodeURL,
    },
  };
};

export interface ContextProps {
  layer2: Layer2;
  addTokenToMetamask: (
    library: any,
    address: string,
    decimals: number
  ) => Promise<boolean>;
  config: Config;
  wallets: Wallet[];
}

export const L2Context = createContext({} as ContextProps);

export const L2Provider = ({ children, layer2Args }: ProviderProps) => {
  const layer2 = new Layer2(layer2Args);
  const config = getConfig(layer2Args);
  const wallets = layer2.wallets;

  const value = {
    layer2,
    addTokenToMetamask,
    config,
    wallets,
  };
  return (
    <L2Context.Provider value={value}>
      <DAppProvider config={config}>{children}</DAppProvider>
    </L2Context.Provider>
  );
};

export const useLayer2 = () => {
  return useContext(L2Context);
};
