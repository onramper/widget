import { Config, DAppProvider, Mainnet, Chain, Rinkeby } from '@usedapp/core';
import { Interface, Fragment, JsonFragment } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { ERC20, SwapRouter } from '../abis';
import React, { createContext, ReactNode, useContext } from 'react';
import { Wallet, initializeWallets } from './wallets';
import { BigNumber } from 'ethers';
import { parseEther } from '@ethersproject/units';

// No need change the address, same is for all testnets and mainnet
export const SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
export const ROUTER_API =
  'https://a7sf9dqtif.execute-api.eu-central-1.amazonaws.com/prod';
export const TOKEN_LIST = 'https://tokens.uniswap.org/';

export const DEFAULTS = {
  slippageTolerance: 5,
  deadline: 200,
};

export interface SwapParams {
  data: string; // route.methodParameters.calldata,
  to: string; //  V3_SWAP_ROUTER_ADDRESS,
  value: BigNumber; // BigNumber.from(route.methodParameters.value),
  gasPrice: BigNumber;
}
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
  symbol: string;
  decimals: number;
  wethAddress: string;
}

export interface QuoteResult {
  blockNumber: string;
  amount: string;
  amountDecimals: string;
  quote: string;
  quoteDecimals: string;
  quoteGasAdjusted: string;
  quoteGasAdjustedDecimals: string;
  gasUseEstimateQuote: string;
  gasUseEstimateQuoteDecimals: string;
  gasUseEstimate: string;
  gasUseEstimateUSD: string;
  gasPriceWei: string;
  route: any[][];
  routeString: string;
  quoteId: string;
}

export interface RouteResult extends QuoteResult {
  methodParameters: {
    calldata: string; // long-ass hexString
    value: string; // 0x00
  };
}

interface Layer2Args {
  chainID: number;
  readOnlyNodeURL?: string;
}

const chainIdToNetwork: { [key: number]: Chain } = {
  1: Mainnet,
  4: Rinkeby,
};

const chainIDToNetworkInfo: { [key: number]: Info } = {
  1: {
    name: 'mainnet',
    symbol: 'ETH',
    decimals: 18,
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  4: {
    name: 'rinkeby',
    symbol: 'ETH',
    decimals: 18,
    wethAddress: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  },
};

export class Layer2 {
  public CHAIN_ID: number;
  public NODE_URL: string | null;
  public wallets: Wallet[];
  public chainIdToNetworkInfo: Info;
  public config: Config;
  public chainInfo: Chain;
  public interfaces: { [key: string]: Interface };
  public contracts: { [key: string]: Contract };

  constructor({ chainID, readOnlyNodeURL }: Layer2Args) {
    this.CHAIN_ID = chainID;
    this.NODE_URL = readOnlyNodeURL ?? null;
    this.wallets = initializeWallets(chainID);
    this.chainInfo = chainIdToNetwork[chainID];

    this.config = {
      autoConnect: false,
      notifications: {
        expirationPeriod: 30000,
        checkInterval: 2000,
      },
      readOnlyChainId: this.CHAIN_ID,
      readOnlyUrls: this.NODE_URL
        ? {
            [this.CHAIN_ID]: this.NODE_URL,
          }
        : {},
    };

    this.chainIdToNetworkInfo = chainIDToNetworkInfo[chainID];

    this.interfaces = {
      erc20Interface: this.loadInterface(ERC20),
      swapRouterInterface: this.loadInterface(SwapRouter.abi),
    };

    this.contracts = {
      swapRouterContract: this.loadContract(
        SwapRouter.abi,
        SWAP_ROUTER_ADDRESS
      ),
    };
  }

  public async getQuote(
    inputAmount: number, // not formatted
    tokenOut: string,
    exactOut: boolean = false
  ): Promise<QuoteResult | unknown> {
    const tradeType = exactOut ? 'exactOut' : 'exactIn';
    const formattedAmount = parseEther(inputAmount.toString()).toString();

    try {
      const res = await fetch(
        `${ROUTER_API}/quote?tokenInAddress=${this.chainIdToNetworkInfo.symbol}&tokenInChainId=${this.CHAIN_ID}&tokenOutAddress=${tokenOut}&tokenOutChainId=${this.CHAIN_ID}&amount=${formattedAmount}&type=${tradeType}`
      );
      return res.json();
    } catch (error) {
      return error;
    }
  }

  public async getRoute(
    inputAmount: number,
    tokenOut: string,
    recipient: string,
    exactOut: boolean = false
  ): Promise<RouteResult | unknown> {
    const tradeType = exactOut ? 'exactOut' : 'exactIn';
    const formattedAmount = parseEther(inputAmount.toString()).toString();
    const { slippageTolerance, deadline } = DEFAULTS;
    try {
      const res = await fetch(
        `${ROUTER_API}/quote?tokenInAddress=${this.chainIdToNetworkInfo.symbol}&tokenInChainId=${this.CHAIN_ID}&tokenOutAddress=${tokenOut}&tokenOutChainId=${this.CHAIN_ID}&amount=${formattedAmount}&type=${tradeType}&slippageTolerance=${slippageTolerance}&deadline=${deadline}&recipient=${recipient}`
      );
      return res.json();
    } catch (error) {
      return error;
    }
  }

  public async getSwapParams(
    inputAmount: number,
    tokenOut: string,
    recipient: string,
    exactOut: boolean = false
  ): Promise<SwapParams | unknown> {
    try {
      const res = await this.getRoute(
        inputAmount,
        tokenOut,
        recipient,
        exactOut
      );
      const routeResult = res as RouteResult;
      const { calldata, value } = routeResult.methodParameters;
      return {
        data: calldata,
        to: SWAP_ROUTER_ADDRESS,
        value: BigNumber.from(value),
        gasPrice: BigNumber.from(routeResult.gasPriceWei),
      } as SwapParams;
    } catch (error) {
      return error;
    }
  }

  public async getTokens() {
    try {
      const res = await fetch(TOKEN_LIST);
      return res.json();
    } catch (error) {
      return error;
    }
  }

  printVars(): void {
    console.table({
      chainID: this.CHAIN_ID,
      node_URL: this.NODE_URL,
    });
  }

  // return user's address page on Etherscan
  blockExplorerAddressLink(address: string): string | undefined {
    return this.chainInfo.getExplorerAddressLink(address);
  }

  // return user's transaction info page on Etherscan
  blockExplorerTransactionLink(transactionHash: string): string | undefined {
    return this.chainInfo.getExplorerTransactionLink(transactionHash);
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
}

interface ConfigArgs {
  chainID: number;
  readOnlyNodeURL?: string;
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

export const getConfig = ({ chainID, readOnlyNodeURL }: ConfigArgs): Config => {
  return {
    autoConnect: false,
    notifications: {
      expirationPeriod: 30000,
      checkInterval: 2000,
    },
    readOnlyChainId: chainID,
    readOnlyUrls: readOnlyNodeURL
      ? {
          [chainID]: readOnlyNodeURL,
        }
      : {},
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
