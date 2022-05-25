import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BASE_API } from "../ApiContext/api/constants";
import { isTransactionHash } from "../utils";

interface TransactionData {
  transactionId: string; // 'cA_iZlMfIbwHVOp346CQ9w--'
  txHash: string; // '0xd1c23e15108dddca22167f7ac6b528a84060e05a0f7e736e11a9ad3e39e4c891'
  userAddress: string; // '0x5787F70018649cfa4E89D648653D0058eC383bEE'
  nonce: number; // 52
}

interface RawData {
  transactionResponse?: TransactionResponse;
  address: string | null | undefined;
  transactionId: string;
}

// type casting here, we know these values are not null, but the type from the conte3xt will always be nullable
function formatData(data: RawData): TransactionData {
  const { nonce, hash } = data.transactionResponse as TransactionResponse;
  return {
    transactionId: data.transactionId,
    txHash: hash,
    userAddress: data.address as string,
    nonce: nonce,
  };
}

export function storeTransactionData(data: RawData) {
  const formattedData = formatData(data);
  if (!isTransactionHash(formattedData.txHash))
    throw new Error("Invalid transaction hash");

  return fetch(`${BASE_API}/v2/storeTxHash`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedData), // body data type must match "Content-Type" header
  });
}
