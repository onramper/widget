import { TransactionResponse } from "@ethersproject/abstract-provider";
import { TokenInfo } from "layer2";

export interface Transaction {
  apiKey: string;
  countryIp: string;
  gatewayId: number;
  host: string;
  id: string;
  inAmount: number;
  inCurrency: string;
  ip: string;
  lastStatus: "init" | "ok" | "rip";
  // eslint-disable-next-line camelcase
  lastStatus_date: string;
  onramperFee: number;
  outAmount: number;
  outCurrency: string;
  partnerContext: string;
  partnerFee: number;
  paymentMethod: number;
  timestamp: number;
  cryptocurrencyAddress: string;
  l2TokenData: TokenInfo; // important
  customerGateway: string; // "Moonpay_Uniswap",
}

export interface TransactionData {
  transactionId: string; // 'cA_iZlMfIbwHVOp346CQ9w--'
  txHash: string; // '0xd1c23e15108dddca22167f7ac6b528a84060e05a0f7e736e11a9ad3e39e4c891'
  userAddress: string; // '0x5787F70018649cfa4E89D648653D0058eC383bEE'
  nonce: number; // 52
}

export interface RawData {
  transactionResponse: TransactionResponse;
  address: string;
  transactionId: string;
}
