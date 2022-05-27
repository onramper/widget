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
}

export const pollTransaction = async (
  txId: string
): Promise<Transaction | undefined> => {
  const res = await fetch(`/v2/transaction${txId}`);
  const json = (await res.json()) as Transaction;
  if (json.lastStatus === "ok") {
    return json;
  }
};
