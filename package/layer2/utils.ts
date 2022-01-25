import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import {
  ERC_20_ADDRESS,
  NODE_URL,
  tokenDecimals,
  TokenNames,
} from './config/config';

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

// Helper chain data
export const chainIdToNetworkInfo: { [network: string]: Info } = {
  1: {
    name: 'mainnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: [NODE_URL],
    blockExplorerUrls: ['https://etherscan.io/'],
  },
};

// returns formatted string for UI display
export const formatTokenAmount = (
  token: TokenNames,
  amount: BigNumber
): string => {
  return amount ? formatUnits(amount, tokenDecimals[token]) : '0.00';
};

// returns "0x" padded hex of chain ID
export const toHex = (decimal: number): string => {
  return '0x' + decimal.toString(16);
};

// TODO: Web3Provider interface from ethers requires: request?: (request: { method: string, params?: Array<any> }) => Promise<any>
export const addTokenToMetamask = async (library: any): Promise<boolean> => {
  try {
    const result = await library.provider?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: ERC_20_ADDRESS,
          symbol: 'ERC_20',
          decimals: tokenDecimals.erc20,
        },
      } as WatchAssetParams,
    });

    return result;
  } catch (error) {
    return false;
  }
};

// check whether MM is installed in browser
export const isMetamaskEnabled = (): boolean => {
  try {
    if ((window as any)?.ethereum?.isMetaMask === true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
