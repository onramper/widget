import { BASE_API } from "../ApiContext/api/constants";
import { isTransactionHash } from "../utils";

interface TransactionData {
  transactionId: string; // 'cA_iZlMfIbwHVOp346CQ9w--'
  txHash: string; // '0xd1c23e15108dddca22167f7ac6b528a84060e05a0f7e736e11a9ad3e39e4c891'
  userAddress: string; // '0x5787F70018649cfa4E89D648653D0058eC383bEE'
}

export async function storeTransactionData(data: TransactionData) {
  if (!isTransactionHash(data.txHash))
    throw new Error("Invalid transaction hash");

  return fetch(`${BASE_API}/v2/storeTxHash`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
}
